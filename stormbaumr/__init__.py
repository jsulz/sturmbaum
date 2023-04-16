from flask import Flask
import os

def create_app():
    app = Flask(__name__, instance_relative_config=True)

    # @TODO add testing configuration later

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/')
    def hello_world():
        return "hello world"
    
    return app