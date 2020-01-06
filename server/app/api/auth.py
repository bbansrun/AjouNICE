import json

from flask import Response, request
from flask_restplus import Resource
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

from server import db
from server.app.api import api_rest

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

@api_rest.route("/auth/login")
class LoginAPI(Resource):
    def post(self):
        if not request.is_json:
            return Response(json.dumps({ "err": "TypeError: Not JSON Type Request." }), status=400)
        user_id = request.json.get('user_id', None)
        password = request.json.get('password', None)

        user = User.query.filter_by(user_id=user_id).all()
        token_identity = { 'user_id': user_id, 'password': password }
        access_token = create_access_token(identity=token_identity)
        refresh_token = create_refresh_token(identity=token_identity)

        return {
            'access_token': access_token,
            'refresh_token': refresh_token
        }