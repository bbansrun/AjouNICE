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
class User(db.Model):
    __tablename__ = 'users'
    uuid = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(256), index=True, unique=True)
    
    def __repr__(self):
        return '<User %r>' % self.username

# Schema Objects
class UserObject(SQLAlchemyObjectType):
    class Meta:
        model = User
        interfaces = (graphene.relay.Node, )

class Query(graphene.ObjectType):
    node = graphene.relay.Node.Field()
    all_users = SQLAlchemyConnectionField(UserObject)

schema = graphene.Schema(query=Query)