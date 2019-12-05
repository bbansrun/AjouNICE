import pymysql
import graphene
from flask_graphql_auth import GraphQLAuth, query_jwt_required
from graphene_sqlalchemy import SQLAlchemyConnectionField
from .models import UserModel, CollegeModel, UserObject, CollegeObject, Mutation, MessageField, ProtectedUnion
from .. import app
pymysql.install_as_MySQLdb()

# GraphQL JWT Auth
auth = GraphQLAuth(app)

# GraphQL Query
class Query(graphene.ObjectType):
    node = graphene.relay.Node.Field()
    userEmail = graphene.relay.Node.Field(UserObject)
    userEmailList = SQLAlchemyConnectionField(UserObject)
    findUserID = graphene.List(UserObject, user_id=graphene.String(required=True))
    findEmail = graphene.List(UserObject, email=graphene.String(required=True))
    findIdNums = graphene.List(UserObject, identity_num=graphene.Int(required=True))

    protected = graphene.Field(type=ProtectedUnion, token=graphene.String())

    def resolve_findEmail(self, info, **kwargs):
        return UserObject.get_query(info).filter(UserModel.email == kwargs.get('email'))

    def resolve_findIdNums(self, info, **kwargs):
        return UserObject.get_query(info).filter(UserModel.identity_num == kwargs.get('identity_num'))

    def resolve_findUserID(self, info, **kwargs):
        return UserObject.get_query(info).filter(UserModel.user_id == kwargs.get('user_id'))

    @query_jwt_required
    def resolve_protected(self, info):
        return MessageField(message="Hello World!")

schema = graphene.Schema(query=Query, mutation=Mutation)