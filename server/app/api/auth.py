import json

from flask import Response, request
from flask_restplus import Resource
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

from . import api_rest

@api_rest.route("/auth/login")
class LoginAPI(Resource):
    def post(self):
        
        if not request.is_json:
            return Response(json.dumps({ "err": "TypeError: Not JSON Type Request." }), status=400)
        user_id = request.json.get('user_id', None)
        password = request.json.get('password', None)

        token_identity = { 'user_id': user_id, 'password': password }
        access_token = create_access_token(identity=token_identity)
        refresh_token = create_refresh_token(identity=token_identity)

        return {
            'access_token': access_token,
            'refresh_token': refresh_token
        }