from flask_restful import Resource
from flask_jwt_extended import create_access_token, create_refresh_token

class LoginAPI(Resource):
    def post(self):
        token_identity = { 'username': 'bbansrun' }
        access_token = create_access_token(identity=token_identity)
        refresh_token = create_refresh_token(identity=token_identity)

        login_info = ({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user_name': 'bbansrun'
        })
    
        return login_info, 200