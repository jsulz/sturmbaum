from flask import Flask
import os
from . import sturmbaum

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    app.register_blueprint(sturmbaum.sb)

    return app