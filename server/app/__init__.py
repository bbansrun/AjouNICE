import os
import json
import pymysql
from flask import Flask, current_app, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

from .api import api_bp
from .client import client_bp

app = Flask(__name__, static_folder='../dist/static')
app.register_blueprint(api_bp)
app.register_blueprint(client_bp)

pymysql.install_as_MySQLdb()
# Database Connection (RDS)
with open('db_config.json', 'r') as t:
    config = json.load(t)

app.config['JWT_SECRET_KEY'] = config['JWT_SECRET_KEY']
app.config['REFRESH_EXP_LENGTH'] = config['REFRESH_EXP_LENGTH']
app.config['ACCESS_EXP_LENGTH'] = config['ACCESS_EXP_LENGTH']

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://' + config['DB_USER'] + ':' + config['DB_PASSWORD'] + "@" + config['RDS_ENDPOINT'] + '/' + config['DB_INSTANCE']
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)
jwt = JWTManager(app)

from .config import Config
app.logger.info('>>> {}'.format(Config.FLASK_ENV))

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

@app.route('/')
def index_client():
    dist_dir = current_app.config['DIST_DIR']
    entry = os.path.join(dist_dir, 'index.html')
    return send_file(entry)