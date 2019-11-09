import json
import pymysql
import graphene
from .. import app
from flask_sqlalchemy import SQLAlchemy
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
pymysql.install_as_MySQLdb()

# Database Connection (RDS)
with open('db_config.json', 'r') as t:
    config = json.load(t)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://' + config['DB_USER'] + ':' + config['DB_PASSWORD'] + "@" + config['RDS_ENDPOINT'] + '/' + config['DB_INSTANCE']
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)

# DB Models
class College(db.Model):
    __tablename__ = 'colleges'
    college_code = db.Column(db.String(5), primary_key=True)
    college_nm = db.Column(db.String(256))

    def __repr__(self):
        return '<College %r>' % self.college_code

class User(db.Model):
    __tablename__ = 'users'
    user_idx = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(256), index=True, unique=True)
    user_id = db.Column(db.String(256), index=True, unique=True)
    password = db.Column(db.String(256))
    user_nm = db.Column(db.String(256))
    identity_num = db.Column(db.Integer, index=True, unique=True)
    user_type = db.Column(db.String(256))
    user_status = db.Column(db.String(1))
    policy_yn = db.Column(db.Boolean)
    college_code = db.Column(db.String(5))
    college_nm = db.Column(db.String(256))
    dpt_code = db.Column(db.String(256))
    dpt_nm = db.Column(db.String(256))
    auth_email_yn = db.Column(db.Boolean)
    auth_token = db.Column(db.String(256))
    auth_status = db.Column(db.String(1))
    user_profile = db.Column(db.String(256))
    nick_nm = db.Column(db.String(50))
    bamboo_spear = db.Column(db.Integer)
    reg_ip = db.Column(db.String(15))
    reg_dt = db.Column(db.String(256))
    upt_ip = db.Column(db.String(15))
    upt_dt = db.Column(db.String(256))
    log_ip = db.Column(db.String(15))
    log_dt = db.Column(db.String(256))
    
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

schema = graphene.Schema(query=Query)