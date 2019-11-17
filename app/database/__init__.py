import json
import pymysql
import graphene
from .. import app
from flask_sqlalchemy import SQLAlchemy
from flask_graphql_auth import *
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
pymysql.install_as_MySQLdb()

# Database Connection (RDS)
with open('db_config.json', 'r') as t:
    config = json.load(t)

# GraphQL JWT Auth
auth = GraphQLAuth(app)

app.config['JWT_SECRET_KEY'] = config['JWT_SECRET_KEY']
app.config['REFRESH_EXP_LENGTH'] = config['REFRESH_EXP_LENGTH']
app.config['ACCESS_EXP_LENGTH'] = config['ACCESS_EXP_LENGTH']

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://' + config['DB_USER'] + ':' + config['DB_PASSWORD'] + "@" + config['RDS_ENDPOINT'] + '/' + config['DB_INSTANCE']
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)

# DB Models
class MessageField(graphene.ObjectType):
    message = graphene.String()

class ProtectedUnion(graphene.Union):
    class Meta:
        types = (MessageField, AuthInfoField)

    @classmethod
    def resolve_type(cls, instance, info):
        return type(instance)
        
class AuthMutation(graphene.Mutation):
    class Arguments(object):
        username = graphene.String()
        password = graphene.String()

    access_token = graphene.String()
    refresh_token = graphene.String()

    def mutate(self, info, username, password):
        return AuthMutation(access_token=create_access_token(username), refresh_token=create_refresh_token(username))

class RefreshMutation(graphene.Mutation):
    class Arguments(object):
        token = graphene.String()

    new_token = graphene.String()

    def mutate(self, info):
        current_user = get_jwt_identity()
        return RefreshMutation(new_token=create_access_token(identity=current_user))

class ProtectedMutation(graphene.Mutation):
    class Arguments(object):
        token = graphene.String()

    message = graphene.Field(ProtectedUnion)

    @classmethod
    @mutation_jwt_required
    def mutate(cls, _, info):
        return ProtectedMutation(
            message=MessageField(message="AjouNICE!")
        )

class Mutation(graphene.ObjectType):
    auth = AuthMutation.Field()
    refresh = RefreshMutation.Field()
    protected = ProtectedMutation.Field()

class College(db.Model):
    __tablename__ = 'colleges'
    college_code = db.Column(db.String(5), primary_key=True)
    college_nm = db.Column(db.String(256))

    def __repr__(self):
        return '<College %r>' % self.college_code

class User(db.Model):
    __tablename__ = 'USER'
    user_idx = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(256), index=True, unique=True)
    user_id = db.Column(db.String(50), index=True, unique=True)
    password = db.Column(db.String(60))
    user_nm = db.Column(db.String(50))
    identity_num = db.Column(db.Integer, index=True, unique=True)
    user_type = db.Column(db.String(1))
    user_status = db.Column(db.String(1))
    policy_yn = db.Column(db.Boolean)
    college_cd = db.Column(db.String(10))
    dpt_cd = db.Column(db.String(10))
    auth_email_yn = db.Column(db.Boolean)
    auth_token = db.Column(db.String(20))
    user_profile = db.Column(db.String(100))
    nick_nm = db.Column(db.String(50))
    bamboo_stack = db.Column(db.Integer)
    links = db.Column(db.String(50))
    reg_ip = db.Column(db.String(40))
    reg_dt = db.Column(db.DateTime)
    upt_ip = db.Column(db.String(40))
    upt_dt = db.Column(db.DateTime)
    log_ip = db.Column(db.String(40))
    log_dt = db.Column(db.DateTime)
    
    def __repr__(self):
        return '<User %r>' % self.username

# Schema Objects
class CollegeObject(SQLAlchemyObjectType):
    class Meta:
        model = College
        interfaces = (graphene.relay.Node, )

class UserObject(SQLAlchemyObjectType):
    class Meta:
        model = User
        interfaces = (graphene.relay.Node, )

class Query(graphene.ObjectType):
    node = graphene.relay.Node.Field()
    all_users = SQLAlchemyConnectionField(UserObject)
    all_colleges = SQLAlchemyConnectionField(CollegeObject)
    

    protected = graphene.String(token=graphene.String())

    def resolve_protected(self, info, message):
        return str(get_raw_jwt())

schema = graphene.Schema(query=Query, mutation=Mutation)