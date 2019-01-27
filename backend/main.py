from flask import Flask, jsonify, request, render_template, Markup, send_from_directory
from werkzeug.contrib.cache import SimpleCache
from api.plays import plays_route
from flask_cors import CORS
from helpers.cache import cache

app = Flask(__name__)
app.config.from_object('config.BaseConfig')
app.app_context().push()

CORS(app)
app.register_blueprint(plays_route)
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)