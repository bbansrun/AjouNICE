"""
REST API Resource Routing
http://flask-restplus.readthedocs.io
"""

from datetime import datetime
from flask import request
from flask_restplus import Resource
from bs4 import BeautifulSoup

import requests
import json

from .security import require_auth
from . import api_rest

targetURLs = {
    'required': [
        {
            'name': '대학본부',
            'code': 'A0001',
            'boardName': '공지사항',
            'link': 'http://www.ajou.ac.kr/main/ajou/notice.jsp'
        },
        {
            'name': '다산학부대학',
            'code': 'A0002',
            'boardName': '공지사항',
            'link': 'http://uc.ajou.ac.kr/uc/community/community01.jsp'
        },
        {
            'name': '국제학부',
            'code': 'A0003',
            'boardName': '공지사항',
            'link': 'http://isa.ajou.ac.kr/isa/community/community03.jsp'
        },
    ],
    'agencies': [
        {
            'name': '공과대학',
            'code': 'A0004',
            'boardName': '공지사항',
            'link': 'http://eng.ajou.ac.kr/eng/community/notice.jsp'
        },
        {
            'name': '정보통신대학',
            'code': 'A0005',
            'boardName': '공지사항',
            'link': 'http://it.ajou.ac.kr/it/community/community01.jsp'
        },
        {
            'name': '자연과학대학',
            'code': 'A0006',
            'boardName': '공지사항',
            'link': 'http://ns.ajou.ac.kr/ns/board/board01.jsp'
        },
        {
            'name': '경영대학',
            'code': 'A0007',
            'boardName': '공지사항',
            'link': 'http://biz.ajou.ac.kr/biz/community/community01.jsp'
        },
        {
            'name': '인문대학',
            'code': 'A0008',
            'boardName': '공지사항',
            'link': 'http://human.ajou.ac.kr/human/commnuity/community07.jsp'
        },
        {
            'name': '사회과학대학',
            'code': 'A0009',
            'boardName': '공지사항',
            'link': 'http://coss.ajou.ac.kr/coss/community/community01.jsp'
        },
    ],
    'departments': [
        {
            'name': '공과대학 - 기계공학과',
            'code': 'ME0001',
            'boardName': '공지사항',
            'link': 'http://me.ajou.ac.kr/me/board/board01.jsp'
        },
        {
            'name': '공과대학 - 산업공학과',
            'code': 'ME0002',
            'boardName': '공지사항',
            'link': 'http://ie.ajou.ac.kr/ie/board/board01.jsp'
        },
        {
            'name': '공과대학 - 화학공학과',
            'code': 'ME0003',
            'boardName': '공지사항',
            'link': 'http://che.ajou.ac.kr/che/community/community03.jsp'
        },
        {
            'name': '공과대학 - 신소재공학과',
            'code': 'ME0004',
            'boardName': '공지사항',
            'link': 'http://mse.ajou.ac.kr/mse/board/board03.jsp'
        },
        {
            'name': '공과대학 - 응용화학생명공학과',
            'code': 'ME0005',
            'boardName': '공지사항',
            'link': 'http://chembio.ajou.ac.kr/chembio/board/board01.jsp'
        },
        {
            'name': '공과대학 - 환경안전공학과',
            'code': 'ME0006',
            'boardName': '공지사항',
            'link': 'http://env.ajou.ac.kr/env/board/board03.jsp'
        },
        {
            'name': '공과대학 - 건설시스템공학과',
            'code': 'ME0007',
            'boardName': '공지사항',
            'link': 'http://ce.ajou.ac.kr/ce/board/board03.jsp'
        },
        {
            'name': '공과대학 - 교통시스템공학과',
            'code': 'ME0008',
            'boardName': '공지사항',
            'link': 'http://tse.ajou.ac.kr/tse/board/board03.jsp'
        },
        {
            'name': '공과대학 - 건축학과(건축학/건축공학전공)',
            'code': 'ME0009',
            'boardName': '공지사항',
            'link': 'http://arch.ajou.ac.kr/arch/index.jsp'
        },
        {
            'name': '공과대학 - 융합시스템공학과',
            'code': 'ME0010',
            'boardName': '공지사항',
            'link': 'http://ise.ajou.ac.kr/ise/board/notice.jsp'
        },
        {
            'name': '정보통신대학 - 전자공학과',
            'code': 'IT0001',
            'boardName': '공지사항',
            'link': 'http://ece.ajou.ac.kr/ece/board/board01.jsp'
        },
        {
            'name': '정보통신대학 - 미디어학과',
            'code': 'IT0002',
            'boardName': '공지사항',
            'link': 'http://media.ajou.ac.kr/media/board/board01.jsp'
        },
        {
            'name': '정보통신대학 - 사이버보안학과',
            'code': 'IT0003',
            'boardName': '공지사항',
            'link': 'http://security.ajou.ac.kr/security/board/board01.jsp'
        },
        {
            'name': '정보통신대학 - 소프트웨어학과',
            'code': 'IT0004',
            'boardName': '공지사항',
            'link': 'http://software.ajou.ac.kr/bbs/board.php?tbl=notice'
        },
        {
            'name': '정보통신대학 - 국방디지털융합학과',
            'code': 'IT0005',
            'boardName': '공지사항',
            'link': 'http://mdc.ajou.ac.kr/mdc/board/board01.jsp'
        },
        {
            'name': '자연과학대학 - 수학과',
            'code': 'NS0001',
            'boardName': '공지사항',
            'link': 'http://math.ajou.ac.kr/math/board/board01.jsp'
        },
        {
            'name': '자연과학대학 - 화학과',
            'code': 'NS0002',
            'boardName': '공지사항',
            'link': 'http://chem.ajou.ac.kr/chem/community/community01.jsp'
        },
        {
            'name': '자연과학대학 - 물리학과',
            'code': 'NS0003',
            'boardName': '공지사항',
            'link': 'http://physics.ajou.ac.kr/physics/board/board01.jsp'
        },
        {
            'name': '자연과학대학 - 생명과학과',
            'code': 'NS0004',
            'boardName': '공지사항',
            'link': 'http://biology.ajou.ac.kr/biolog/board/board01.jsp'
        },
        {
            'name': '경영대학 - 경영학과',
            'code': 'BZ0001',
            'boardName': '공지사항',
            'link': 'http://abiz.ajou.ac.kr/abiz/board/board01.jsp'
        },
        {
            'name': '경영대학 - 금융공학과',
            'code': 'BZ0002',
            'boardName': '공지사항',
            'link': 'http://fe.ajou.ac.kr/fe/board/research01.jsp'
        },
        {
            'name': '경영대학 - e-비즈니스학과',
            'code': 'BZ0003',
            'boardName': '공지사항',
            'link': 'http://ebiz.ajou.ac.kr/ebiz/index.jsp'
        },
        {
            'name': '경영대학 - 글로벌경영학과',
            'code': 'BZ0004',
            'boardName': '공지사항',
            'link': 'http://gb.ajou.ac.kr/gb/index.jsp'
        },
        {
            'name': '인문대학 - 국어국문학과',
            'code': 'HU0001',
            'boardName': '공지사항',
            'link': 'http://human.ajou.ac.kr/kor/board/board01.jsp'
        },
        {
            'name': '인문대학 - 불어불문학과',
            'code': 'HU0002',
            'boardName': '공지사항',
            'link': 'http://france.ajou.ac.kr/france/community/community04.jsp'
        },
        {
            'name': '인문대학 - 문화콘텐츠학과',
            'code': 'HU0003',
            'boardName': '공지사항',
            'link': 'http://culture.ajou.ac.kr/culture/board/board01.jsp'
        },
        {
            'name': '인문대학 - 영어영문학과',
            'code': 'HU0004',
            'boardName': '공지사항',
            'link': 'http://human.ajou.ac.kr/english/board/board01.jsp'
        },
        {
            'name': '인문대학 - 사학과',
            'code': 'HU0005',
            'boardName': '공지사항',
            'link': 'http://history.ajou.ac.kr/history/board/board01.jsp'
        },
        {
            'name': '사회과학대학 - 경제학과',
            'code': 'SS0001',
            'boardName': '공지사항',
            'link': 'http://econ.ajou.ac.kr/econ/community/community03.jsp'
        },
        {
            'name': '사회과학대학 - 심리학과',
            'code': 'SS0002',
            'boardName': '공지사항',
            'link': 'http://apsy.ajou.ac.kr/apsy/community/community04.jsp'
        },
        {
            'name': '사회과학대학 - 정치외교학과',
            'code': 'SS0003',
            'boardName': '공지사항',
            'link': 'http://pol.ajou.ac.kr/pol/community/community04.jsp'
        },
        {
            'name': '사회과학대학 - 행정학과',
            'code': 'SS0004',
            'boardName': '공지사항',
            'link': 'http://pba.ajou.ac.kr/pba/community/community03.jsp'
        },
        {
            'name': '사회과학대학 - 사회학과',
            'code': 'SS0005',
            'boardName': '공지사항',
            'link': 'http://soci.ajou.ac.kr/soci/community/community03.jsp'
        },
        {
            'name': '사회과학대학 - 스포츠레저학과',
            'code': 'SS0006',
            'boardName': '공지사항',
            'link': 'http://slez.ajou.ac.kr/slez/community/community03.jsp'
        }
    ],
    'united': [
        {
            'name': '의과대학',
            'code': 'MC0001',
            'boardName': '공지사항',
            'link': 'http://ts.ajoumc.or.kr/Board/Retrieve.aspx?cp=1&sid=&rc=10&mc=UH00100033&ssc=0010&ssgc=UH&smpc=UH00100006&CCP=1'
        },
        {
            'name': '간호대학',
            'code': 'MC0002',
            'boardName': '공지사항',
            'link': 'http://ts.ajoumc.or.kr/Board/Retrieve.aspx?cp=1&sid=&rc=10&mc=UH00070080&ssc=0007&ssgc=UH&smpc=UH00070018&CCP=1'
        },
        {
            'name': '약학대학',
            'code': 'PH0001',
            'boardName': '공지사항',
            'link': 'http://pharm.ajou.ac.kr/pharm/community/community01.jsp'
        }
    ]
}

def parseContent(soup, urlInfo):
    posts = []
    for post in soup.select('#jwxe_main_content > div > div.list_wrap > table > tbody > tr'):
        try:
            title = post.find('td', class_='title_comm').a.text.strip()
            link = urlInfo['link'] + post.find('td', class_='title_comm').a['href']
            posts.append({
                'unit': urlInfo['name'],
                'code': urlInfo['code'],
                'boardName': urlInfo['boardName'],
                'title': title,
                'link': link
            })
        except:
            pass
    return posts

class SecureResource(Resource):
    """ Calls require_auth decorator on all requests """
    method_decorators = [require_auth]

@api_rest.route('/notice/<string:code>')
class Bbansrun(Resource):    
    def get(self, code):
        return {
            'title': 'bbansrun',
            'message': '빤스런 프로젝트 아주나이스 - 아주대 차세대 학부 커뮤니티 서비스',
            'APIName': '/notice/<code>',
            'APIDescription': '본부대학급 공지사항 크롤러',
            'result': parseContent(BeautifulSoup(requests.get(list(filter(lambda x: x['code'] == code, targetURLs['required']))[0]['link']).text, 'html.parser'), list(filter(lambda x: x['code'] == code, targetURLs['required']))[0])
        }

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
