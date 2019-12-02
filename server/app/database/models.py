import json
import graphene
from .. import app
from flask_graphql_auth import AuthInfoField, GraphQLAuth, get_jwt_identity, get_raw_jwt, create_access_token, create_refresh_token, query_jwt_required, mutation_jwt_refresh_token_required, mutation_jwt_required
from flask_sqlalchemy import SQLAlchemy
from graphene_sqlalchemy import SQLAlchemyObjectType
from werkzeug.security import generate_password_hash, check_password_hash

# Database Connection (RDS)
with open('db_config.json', 'r') as t:
    config = json.load(t)

app.config['JWT_SECRET_KEY'] = config['JWT_SECRET_KEY']
app.config['REFRESH_EXP_LENGTH'] = config['REFRESH_EXP_LENGTH']
app.config['ACCESS_EXP_LENGTH'] = config['ACCESS_EXP_LENGTH']
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql://{config['DB_USER']}:{config['DB_PASSWORD']}@{config['RDS_ENDPOINT']}/{config['DB_INSTANCE']}"
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)

# Authentication
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

    @classmethod
    def mutate(cls, _, info, username, password):
        return AuthMutation(
            access_token=create_access_token(username),
            refresh_token=create_refresh_token(username)
        )

class ProtectedMutation(graphene.Mutation):
    class Arguments(object):
        token = graphene.String()
    
    message = graphene.Field(ProtectedUnion)

    @classmethod
    @mutation_jwt_required
    def mutate(cls, _, info):
        return ProtectedMutation(
            message=MessageField(message="Protected Mutation Works")
        )

class RefreshMutation(graphene.Mutation):
    class Arguments(object):
        refresh_token = graphene.String()

    new_token = graphene.String()

    @classmethod
    @mutation_jwt_refresh_token_required
    def mutate(self, _):
        current_user = get_jwt_identity()
        return RefreshMutation(new_token=create_access_token(identity=current_user))

class Mutation(graphene.ObjectType):
    auth = AuthMutation.Field()
    refresh = RefreshMutation.Field()
    protected = ProtectedMutation.Field()

# DB Models
class DepartmentModel(db.Model):
    __tablename__ = 'DEPARTMENT'
    dpt_cd = db.Column(db.String(8), primary_key=True)
    dpt_nm = db.Column(db.String(50))
    college_cd = db.Column(db.String(4))
    exist_yn = db.Column(db.String(1))
    reg_ip = db.Column(db.String(40))
    reg_dt = db.Column(db.DateTime)
    upt_ip = db.Column(db.String(40))
    upt_dt = db.Column(db.DateTime)
    
    def __repr__(self):
        return f"<Department ${self.dpt_cd}>"

class CollegeModel(db.Model):
    __tablename__ = 'COLLEGE'
    college_cd = db.Column(db.String(4), primary_key=True)
    college_nm = db.Column(db.String(30))
    exist_yn = db.Column(db.String(1))
    reg_ip = db.Column(db.String(40))
    reg_dt = db.Column(db.DateTime)
    upt_ip = db.Column(db.String(40))
    upt_dt = db.Column(db.DateTime)

    def __repr__(self):
        return f"<College ${self.college_cd}>" 

class UserModel(db.Model):
    __tablename__ = 'USER'
    user_idx = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(256), unique=True)
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
    user_profile = db.Column(db.String(256))
    nick_nm = db.Column(db.String(50))
    bamboo_stack = db.Column(db.Integer)
    links = db.Column(db.String(256))
    reg_ip = db.Column(db.String(40))
    reg_dt = db.Column(db.DateTime)
    upt_ip = db.Column(db.String(40))
    upt_dt = db.Column(db.DateTime)
    log_ip = db.Column(db.String(40))
    log_dt = db.Column(db.DateTime)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def __repr__(self):
        return f"<User('{self.user_idx}', '{self.userNm}', '{self.email}')>"

class UserObject(SQLAlchemyObjectType):
    class Meta:
        model = UserModel
        interfaces = (graphene.relay.Node, )

class CollegeObject(SQLAlchemyObjectType):
    class Meta:
        model = CollegeModel
        interfaces = (graphene.relay.Node, )