from flask_restplus import Resource
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

from . import api_rest

@api_rest.route("/auth/login")
class LoginAPI(Resource):
    def post(self):
        token_identity = { 'username': 'bbansrun' }
        access_token = create_access_token(identity=token_identity)
        refresh_token = create_refresh_token(identity=token_identity)

        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user_name': 'bbansrun'
        }