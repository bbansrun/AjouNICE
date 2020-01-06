import os
import json
import pymysql
from flask import Flask, current_app, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

from server.app.api import api_bp
from server.app.client import client_bp

pymysql.install_as_MySQLdb()

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__, static_folder='./dist/static')
    app.register_blueprint(api_bp)
    app.register_blueprint(client_bp)

    # Database Connection (RDS)
    with open(os.path.join(os.path.dirname(__file__), 'db_config.json'), 'r') as t:
        config = json.load(t)
        
    FLASK_ENV =  os.getenv('FLASK_ENV', 'production')
    SECRET_KEY = os.getenv('FLASK_SECRET', 'Secret')
    
    APP_DIR = os.path.dirname(__file__)
    DIST_DIR = os.path.join(APP_DIR, 'dist')

    if not os.path.exists(DIST_DIR):
        raise Exception('DIST_DIR not found: {}'.format(DIST_DIR))

    app.logger.info('>>> {}'.format(FLASK_ENV))

    app.config['FLASK_ENV'] = FLASK_ENV
    app.config['SECRET_KEY'] = SECRET_KEY
    app.config['APP_DIR'] = APP_DIR
    app.config['DIST_DIR'] = DIST_DIR

    app.config['JWT_SECRET_KEY'] = config['JWT_SECRET_KEY']
    app.config['REFRESH_EXP_LENGTH'] = config['REFRESH_EXP_LENGTH']
    app.config['ACCESS_EXP_LENGTH'] = config['ACCESS_EXP_LENGTH']

    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://' + config['DB_USER'] + ':' + config['DB_PASSWORD'] + "@" + config['RDS_ENDPOINT'] + '/' + config['DB_INSTANCE']
    app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

    db.init_app(app)
    jwt.init_app(app)

    return app

app = create_app()

@app.route('/')
def index_client():
    dist_dir = current_app.config['DIST_DIR']
    entry = os.path.join(dist_dir, 'index.html')
    return send_file(entry)
