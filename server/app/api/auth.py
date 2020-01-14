import jwt
import json
import base64
from datetime import datetime, timedelta, timezone

from flask import Response, request
from flask_restplus import Resource
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
    auth_email_yn = db.Column(db.String(1))
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


class Tokenizer():
    """
    Token Manager for providing Single Sign On Service
    """

    def __init__(self, secret, access_token=None):
        self.access_token = access_token
        self.refresh_token = None
        self.secret = secret
        self.payload = None

    def req_timestamp(self, now=False):
        tz = timezone(timedelta(hours=9))
        if now:
            return int(datetime.timestamp(datetime.now(tz)))
        else:
            return int(datetime.timestamp(datetime.now(tz) + timedelta(seconds=3600)))

    def create_payload(self, user):
        self.payload = {
            'exp': self.req_timestamp(),
            'iss': 'AjouNICE!_APIserver',
            'sub': 'AjouNICE!_SSO',
            'iat': self.req_timestamp(now=True),
            'user': {
                'email': user.email,
                'name': user.user_nm,
                'idx': user.user_idx
            }
        }

    def create_refresh_token(self, additional_data=None):
        payload = self.validate_token()
        if payload[0]:
            payload[-1].update(dict(exp=self.req_timestamp()))
            if additional_data is not None:
                payload[-1].update(additional_data)
            return (True, '201', jwt.encode(payload[-1], self.secret, algorithm='HS256').decode('utf-8'))
        else:
            return payload

    def create_access_token(self):
        return jwt.encode(self.payload, self.secret, algorithm='HS256').decode('utf-8')

    def validate_token(self, audience=None):
        identity = None
        try:
            identity = jwt.decode(
                self.access_token, self.secret, audience=audience, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return (False, '401', 'Expired Token')
        except jwt.InvalidAudienceError:
            return (False, '401', 'Invalid Audience')
        except jwt.InvalidSignatureError:
            return (False, '401', 'Invalid Signature')
        except jwt.InvalidTokenError:
            return (False, '401', 'Invalid Token')
        except Exception as e:
            return (False, '500', str(e))
        else:
            return (True, '201', identity)


SECRET_KEY = '4j0uN1ce1'


def jsonResponse(payload, status_code):
    return Response(json.dumps(payload), status=status_code, mimetype='application/json')


@api_rest.route("/auth/login")
class LoginAPI(Resource):
    def post(self):
        if not request.is_json:
            return jsonResponse({"err": "TypeError: Not JSON Type Request."}, 400)

        user_id = request.json.get('user_id', None)
        password = request.json.get('password', None)

        user = User.query.filter_by(user_id=user_id).first()
        compare_pw = user.password
        result = bcrypt.check_password_hash(compare_pw, password)

        if result:
            tokenizer = Tokenizer(secret=SECRET_KEY)
            tokenizer.create_payload(user)
            access_token = tokenizer.create_access_token()
            return jsonResponse({
                'title': 'AjouNICE!',
                'message': '빤스런 프로젝트 아주나이스 - 아주대 차세대 학부 커뮤니티 서비스',
                'APIName': '/auth/login',
                'APIDescription': '로그인 토큰처리',
                'result': {
                    'code': '201',
                    'access_token': access_token,
                    'auth_email_yn': user.auth_email_yn
                }
            }, 201)
        else:
            return jsonResponse({
                'title': 'AjouNICE!',
                'message': '빤스런 프로젝트 아주나이스 - 아주대 차세대 학부 커뮤니티 서비스',
                'APIName': '/auth/login',
                'APIDescription': '로그인 토큰처리',
                'result': {
                    'code': '401',
                    'message': '로그인 정보가 올바르지 않습니다.'
                }
            }, 401)


@api_rest.route("/auth/updatepw")
class UpdatepwAPI(Resource):
    def post(self):
        confirmed_request = False
        headers = request.headers
        if not request.is_json:
            return jsonResponse({"err": "TypeError: Not JSON Type Request."}, 400)
        # new_password, new_password_confirm matching
        new_password = request.json.get('new_password', None)
        new_password_confirm = request.json.get('new_password_confirm', None)
        if not new_password or new_password != new_password_confirm:
            return jsonResponse({
                'msg': 'new_password confirm doesn\'t match'
            }, 400)

        # password 분실
        auth_token = request.args.get('auth_token', None)
        if auth_token:
            user = User.query.filter_by(auth_token=auth_token).first()
            if not user:
                return jsonResponse({
                    'msg': 'Invalid auth token'
                }, 400)

            confirmed_request = True

        # password 변경
        if 'Authorization' in headers and 'Bearer' in headers.get('Authorization'):
            token = request.headers.get('Authorization')
            try:
                token = token.split(' ')[-1]
            except:
                return jsonResponse({
                    'msg': 'Authorization Value Format doesn\'t matched with the value server requires.'
                }, 401)

            tokenizer = Tokenizer(secret=SECRET_KEY, access_token=token)
            validate_result = tokenizer.validate_token()
            isValid = validate_result[0]
            identity = validate_result[2]
            print(identity)
            if not isValid:
                return jsonResponse({
                    'msg': identity[-1]
                }, int(identity[1]))
            # password 변경 old_password 확인 로직
            user_idx = identity['user']['idx']
            user = User.query.filter_by(user_idx=user_idx).first()
            old_password = request.json.get('old_password', None)
            match = bcrypt.check_password_hash(user.password, old_password)
            if not match:
                return jsonResponse({
                    'msg': 'Wrong Old Password'
                }, 401)
            confirmed_request = True

        if confirmed_request:
            print(new_password)
            user.password = bcrypt.generate_password_hash(new_password, 10)
            db.session.commit()
            return jsonResponse({
                'msg': 'password updated'
            }, 201)

        return jsonResponse({
            'msg': 'Bad Request'
        }, 400)


@api_rest.route("/auth/refresh")
class RefreshAPI(Resource):
    def get(self):
        if 'Authorization' not in request.headers:
            return jsonResponse({
                'msg': 'Authorization Header Needed'
            }, 401)

        token = request.headers.get('Authorization')
        if 'Bearer' not in token:
            return jsonResponse({
                'msg': 'Authorization Value Format doesn\'t matched with the value server requires.'
            }, 401)

        try:
            token = token.split(' ')[-1]
        except:
            return jsonResponse({
                'msg': 'Authorization Value Format doesn\'t matched with the value server requires.'
            }, 401)
        else:
            tokenizer = Tokenizer(secret=SECRET_KEY, access_token=token)
            identity = tokenizer.create_refresh_token()
            if identity[0]:
                return jsonResponse({
                    'title': 'AjouNICE!',
                    'message': '빤스런 프로젝트 아주나이스 - 아주대 차세대 학부 커뮤니티 서비스',
                    'APIName': '/auth/refresh',
                    'APIDescription': '토큰 연장처리',
                    'result': {
                        'code': '201',
                        'refresh_token': identity[-1],
                    }
                }, 201)
            else:
                return jsonResponse({
                    'msg': identity[-1]
                }, int(identity[1]))


@api_rest.route("/protected")
class Protected(Resource):
    def get(self):
        if 'Authorization' not in request.headers:
            return jsonResponse({
                'msg': 'Authorization Header Needed'
            }, 401)

        token = request.headers.get('Authorization')
        if 'Bearer' not in token:
            return jsonResponse({
                'msg': 'Authorization Value Format doesn\'t matched with the value server requires.'
            }, 401)

        try:
            token = token.split(' ')[-1]
        except:
            return jsonResponse({
                'msg': 'Authorization Value Format doesn\'t matched with the value server requires.'
            }, 401)
        else:
            tokenizer = Tokenizer(secret=SECRET_KEY, access_token=token)
            identity = tokenizer.validate_token()
            if identity[0]:
                return jsonResponse(identity[-1], 201)
            else:
                return jsonResponse({
                    'msg': identity[-1]
                }, int(identity[1]))
