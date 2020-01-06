from flask import Blueprint
from flask_restplus import Api

api_bp = Blueprint('api_bp', __name__, url_prefix='/api')
api_rest = Api(app=api_bp,
    version="1.0",
    title="아주나이스 API",
    description="아주대학교 차세대 학부 커뮤니티 서비스"
)

@api_bp.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response

# Import resources to ensure view is registered # NOQA
from server.app.api.auth import *
from server.app.api.resources import *
