from datetime import datetime
from flask import request
from flask_restplus import Resource

import json

from server.app.api import api_rest
from server.app.api.security import require_auth
from .customutils.crawl_utils import parse_content_type1, parse_content_type2, parse_content_type3, parse_content


class SecureResource(Resource):
    """ Calls require_auth decorator on all requests """
    method_decorators = [require_auth]

# Get Remote IP for signing up
@api_rest.route('/reqClientIP')
class Client(Resource):
    def get(self):
        return {
            'title': 'AjouNICE!',
            'message': '빤스런 프로젝트 아주나이스 - 아주대 차세대 학부 커뮤니티 서비스',
            'APIName': '/reqClientIP/',
            'APIDescription': '회원가입 처리 위한 클라이언트 Remote IP 확보',
            'result': {
                'ip': request.remote_addr
            }
        }
# issues
# 국디 공지사항 없음 code: IT0005
# 수학과 html 깨져있음 ㅡㅡ
@api_rest.route('/notice/<string:code>')
class Bbansrun(Resource):
    def get(self, code):
        api_response = {
            'title': 'bbansrun',
            'message': '빤스런 프로젝트 아주나이스 - 아주대 차세대 학부 커뮤니티 서비스',
            'APIName': '/notice/<code>',
            'APIDescription': '공지사항 크롤러',
        }
        crawl_result = parse_content(code)
        if crawl_result:
            api_response['result'] = crawl_result
            return api_response
        api_response['error'] = {'message': 'Code not exists'}
        return api_response


@api_rest.route('/resource/<string:resource_id>')
class ResourceOne(Resource):
    """ Unsecure Resource Class: Inherit from Resource """

    def get(self, resource_id):
        timestamp = datetime.utcnow().isoformat()
        return {'timestamp': timestamp}

    def post(self, resource_id):
        json_payload = request.json
        return {'timestamp': json_payload}, 201


@api_rest.route('/secure-resource/<string:resource_id>')
class SecureResourceOne(SecureResource):
    """ Unsecure Resource Class: Inherit from Resource """

    def get(self, resource_id):
        timestamp = datetime.utcnow().isoformat()
        return {'timestamp': timestamp}
