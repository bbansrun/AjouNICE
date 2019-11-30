import pymysql
import graphene
from flask_graphql_auth import GraphQLAuth
from graphene_sqlalchemy import SQLAlchemyConnectionField
from .models import UserModel, CollegeModel, UserObject, CollegeObject
from .. import app
pymysql.install_as_MySQLdb()

# GraphQL JWT Auth
auth = GraphQLAuth(app)

# GraphQL Query
class Query(graphene.ObjectType):
    node = graphene.relay.Node.Field()
    userEmail = graphene.relay.Node.Field(UserObject)
    userEmailList = SQLAlchemyConnectionField(UserObject)
    findEmail = graphene.List(UserObject, email=graphene.String(required=True))
    findIdNums = graphene.List(UserObject, identity_num=graphene.Int(required=True))

    def resolve_findEmail(self, info, **kwargs):
        return UserObject.get_query(info).filter(UserModel.email.contains(kwargs.get('email')))

    def resolve_findIdNums(self, info, **kwargs):
        return UserObject.get_query(info).filter(UserModel.identity_num == kwargs.get('identity_num'))

schema = graphene.Schema(query=Query)