import os
from app import app

class Config(object):
    APP_DIR = os.path.dirname(__file__)
    ROOT_DIR = os.path.dirname(APP_DIR)
    DIST_DIR = os.path.join(ROOT_DIR, 'dist')

    if not os.path.exists(DIST_DIR):
        raise Exception('DIST_DIR not found: {}'.format(DIST_DIR))

app.config.from_object('app.config.Config')
