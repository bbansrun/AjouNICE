import json

from flask import Response, request
from flask_restplus import Resource
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
from flask_sqlalchemy import SQLAlchemy

from server import db, bcrypt
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
        return '<User %r>' % self.user_nm

@api_rest.route("/auth/login")
class LoginAPI(Resource):
    def post(self):
        if not request.is_json:
            return Response(json.dumps({ "err": "TypeError: Not JSON Type Request." }), status=400)
        
        user_id = request.json.get('user_id', None)
        password = request.json.get('password', None)

        user = User.query.filter_by(user_id=user_id).first()
        compare_pw = user.password
        result = bcrypt.check_password_hash(compare_pw, password)

        if result:
            token_identity = { 'user_id': user_id, 'user_nm': user.user_nm, 'identity_num': user.identity_num, 'user_type': user.user_type, 'user_status': user.user_status, 'college_cd': user.college_cd, 'dpt_cd': user.dpt_cd, 'nick_nm': user.nick_nm, 'email': user.email, 'auth_email_yn': user.auth_email_yn }
            access_token = create_access_token(identity=token_identity)
            refresh_token = create_refresh_token(identity=token_identity)

            return Response(json.dumps({
                'title': 'AjouNICE!',
                'message': '빤스런 프로젝트 아주나이스 - 아주대 차세대 학부 커뮤니티 서비스',
                'APIName': '/auth/login',
                'APIDescription': '로그인 토큰처리',
                'result': {
                    'code': '200',
                    'access_token': access_token,
                    'refresh_token': refresh_token,
                    'auth_email_yn': user.auth_email_yn
                }
            }), status=200)
        else:
            return Response(json.dumps({
                'title': 'AjouNICE!',
                'message': '빤스런 프로젝트 아주나이스 - 아주대 차세대 학부 커뮤니티 서비스',
                'APIName': '/auth/login',
                'APIDescription': '로그인 토큰처리',
                'result': {
                    'code': '401',

                    'message': '비밀번호가 일치하지 않습니다.'
                }
            }), status=401)

@api_rest.route("/protected")
class Protected(Resource):
    @jwt_required
    def get(self):
        current_user = get_jwt_identity()
        return Response(json.dumps({
            'logged_in_as': current_user
        }), status=200)