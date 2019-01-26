from flask import Blueprint, jsonify, session, request
from flask_apispec import use_kwargs
from schema import plays

plays_blueprint_name = 'plays'
plays_route = Blueprint(plays_blueprint_name, __name__, url_prefix='/{}'.format(plays_blueprint_name))


@plays_route.route('', methods=['POST'])
def reset_data():
    request_data, err = plays.PlaysRequestSchema().load(request.get_json(force=True))
    if err:
        return jsonify({'data':{}, 'error': err})
    return jsonify({'data': request_data})