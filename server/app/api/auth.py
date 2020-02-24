import jwt
import json
import hashlib
from datetime import datetime, timedelta, timezone

from flask import Response, request
from flask_restplus import Resource
from flask_sqlalchemy import SQLAlchemy

from server import db, bcrypt
from server.app.api import api_rest

SECRET_KEY = '4j0uN1ce1'

class User(db.Model):
    __tablename__ = 'USER'
    __table_args__ = { 'mysql_collate': 'utf8_general_ci' }

    user_idx = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(256), index=True, unique=True)
    user_id = db.Column(db.String(50), index=True, unique=True)
    password = db.Column(db.String(60))
    user_nm = db.Column(db.String(50))
    identity_num = db.Column(db.Integer, index=True, unique=True)
    admin_type = db.Column(db.String(10))
    user_type = db.Column(db.String(1))
    sex_gb = db.Column(db.String(1))
    user_status = db.Column(db.String(1))
    policy_yn = db.Column(db.String(1))
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

    def __init__(self, email, user_id, password, user_nm, identity_num, user_type, sex_gb, college_cd, dpt_cd, auth_token, nick_nm, reg_ip, reg_dt, upt_ip, upt_dt, log_ip, log_dt, admin_type='ORD', policy_yn='Y', user_status='Y', auth_email_yn='N', bamboo_stack=None, user_profile='', links=''):
        self.email = email
        self.user_id = user_id
        self.password = password
        self.user_nm = user_nm
        self.identity_num = identity_num
        self.user_type = user_type
        self.sex_gb = sex_gb
        self.user_status = user_status
        self.college_cd = college_cd
        self.dpt_cd = dpt_cd
        self.auth_token = auth_token
        self.nick_nm = nick_nm
        self.reg_dt = reg_dt
        self.reg_ip = reg_ip
        self.upt_dt = upt_dt
        self.upt_ip = upt_ip
        self.log_dt = log_dt
        self.log_ip = log_ip
        self.admin_type = admin_type
        self.policy_yn = policy_yn
        self.auth_email_yn = auth_email_yn
        self.bamboo_stack = bamboo_stack
        self.user_profile = user_profile
        self.links = links

    def __repr__(self):
        return '<User %r>' % self.user_nm
    
    def as_dict(self):
        return {
            x.name: getattr(self, x.name) for x in self.__table__.columns
        }

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

    def create_payload(self, user, remote_addr):
        self.payload = {
            'exp': self.req_timestamp(),
            'iss': 'AjouNICE!_APIserver',
            'sub': 'AjouNICE!_SSO',
            'iat': self.req_timestamp(now=True),
            'user': {
                'idx': user.user_idx,
                'name': user.user_nm,
                'email': user.email,
                'nick_nm': user.nick_nm,
                'managable': (user.admin_type == 'A'),
                'access_loc': remote_addr
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

def jsonResponse(payload, status_code):
    return Response(json.dumps(payload), status=status_code, mimetype='application/json')

@api_rest.route("/auth/register")
class RegisterAPI(Resource):
    def post(self):
        if not request.is_json:
            return jsonResponse({"err": "TypeError: Not JSON Type Request."}, 400)
        
        rawPassword = request.json.get('password', None)
        hashedPassword = bcrypt.generate_password_hash(rawPassword, 10)
        authToken = hashlib.sha256(hashedPassword).hexdigest()
        new_user_object = {
            'email': request.json.get('email', None),
            'user_id': request.json.get('userId', None),
            'password': hashedPassword,
            'user_nm': request.json.get('userNm', None),
            'identity_num': request.json.get('identityNum', None),
            'user_type': request.json.get('userType', None),
            'sex_gb': request.json.get('sexGb', None),
            'college_cd': request.json.get('collegeCd', None),
            'dpt_cd': request.json.get('dptCd', None),
            'nick_nm': request.json.get('nickNm', None),
            'user_profile': request.json.get('userProfile', None),
            'auth_token': authToken,
            'reg_ip': request.remote_addr,
            'reg_dt': datetime.now(tz=timezone(timedelta(hours=9))),
            'upt_ip': request.remote_addr,
            'upt_dt': datetime.now(tz=timezone(timedelta(hours=9))),
            'log_ip': request.remote_addr,
            'log_dt': datetime.now(tz=timezone(timedelta(hours=9)))
        }
        new_user = User(**new_user_object)
        db.session.add(new_user)
        db.session.commit()

        return jsonResponse({
            'title': 'AjouNICE!',
            'message': '빤스런 프로젝트 아주나이스 - 아주대 차세대 학부 커뮤니티 서비스',
            'APIName': '/auth/register',
            'APIDescription': '회원가입 처리',
            'result': {
                'code': 201,
                'auth_token': authToken
            }
        }, 201)
        

@api_rest.route("/auth/login")
class LoginAPI(Resource):
    def post(self):
        if not request.is_json:
            return jsonResponse({"err": "TypeError: Not JSON Type Request."}, 400)

        user_id = request.json.get('userId', None)
        password = request.json.get('password', None)

        user = User.query.filter_by(user_id=user_id).first()
        match = bcrypt.check_password_hash(user.password, password)
        res = {
            'title': 'AjouNICE!',
            'message': '빤스런 프로젝트 아주나이스 - 아주대 차세대 학부 커뮤니티 서비스',
            'APIName': '/auth/login',
            'APIDescription': '로그인 토큰처리',
        }

        if match:
            # 사용자 마지막 로그인 IP 및 일시 업데이트
            user.log_ip = request.remote_addr
            user.log_dt = datetime.now(tz=timezone(timedelta(hours=9)))
            db.session.commit()

            tokenizer = Tokenizer(secret=SECRET_KEY)
            tokenizer.create_payload(user, request.remote_addr)
            access_token = tokenizer.create_access_token()
            res['result'] = {
                'code': '201',
                'access_token': access_token,
                'auth_email_yn': user.auth_email_yn
            }
            return jsonResponse(res, 201)

        res['result'] = {
            'code': '401',
            'message': '로그인 정보가 올바르지 않습니다.'
        }
        return jsonResponse(res, 401)


@api_rest.route("/auth/update")
class UpdateAPI(Resource):
    def post(self):
        if not request.is_json:
            return jsonResponse({"err": "TypeError: Not JSON Type Request."}, 400)

        confirmed = False

        mode = request.json.get('mode', None)
        authToken = request.json.get('authToken', None)
        prePassword = request.json.get('prePassword', None)
        password = request.json.get('password', None)
        passwordConfirm = request.json.get('passwordConfirm', None)

        if not (password and passwordConfirm) and (password is not passwordConfirm):
            return jsonResponse({
                'title': 'AjouNICE!',
                'message': '빤스런 프로젝트 아주나이스 - 아주대 차세대 학부 커뮤니티 서비스',
                'APIName': '/auth/update',
                'APIDescription': '계정 정보 수정',
                'result': {
                    'code': '400',
                    'message': '정보가 올바르지 않습니다.'
                }
            }, 400)

        if mode == 'reset':
            # Password 분실에 대한 수정 - 이메일 인증 토큰 유효성 검증
            if authToken:
                user = User.query.filter_by(auth_token=authToken).first()
                if not user:
                    return jsonResponse({'msg': 'Invalid auth token'}, 400)
                confirmed = True
        elif mode == 'modify':
            # 로그인된 계정의 Password 변경
            token = request.headers.get('Authorization')
            if token and 'Bearer' in token:
                try:
                    token = token.split(' ')[-1]
                except:
                    return jsonResponse({'msg': 'Authorization Value Format doesn\'t matched with the value server requires.'}, 401)

                tokenizer = Tokenizer(secret=SECRET_KEY, access_token=token)
                validate_result = tokenizer.validate_token()
                isValid = validate_result[0]
                identity = validate_result[2]
                if not isValid:
                    return jsonResponse({'msg': identity[-1]}, int(identity[1]))

                # prePassword 일치 여부 확인
                user_idx = identity['user']['idx']
                user = User.query.filter_by(user_idx=user_idx).first()
                match = bcrypt.check_password_hash(user.password, prePassword)
                if not match:
                    return jsonResponse({'msg': 'Wrong Old Password'}, 401)
                confirmed = True

        if confirmed:
            user.upt_dt = datetime.now(tz=timezone(timedelta(hours=9)))
            user.upt_ip = request.remote_addr
            user.auth_email_yn = 'Y'
            user.password = bcrypt.generate_password_hash(password, 10)
            db.session.commit()
            return jsonResponse({'msg': 'password updated'}, 201)

        return jsonResponse({'msg': 'Bad Request'}, 400)


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
