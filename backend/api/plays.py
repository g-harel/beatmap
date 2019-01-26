from flask import Blueprint, jsonify, session

plays_blueprint_name = 'plays'
plays_route = Blueprint(plays_blueprint_name, __name__, url_prefix='/{}'.format(plays_blueprint_name))


@plays_route.route('', methods=['GET'])
def reset_data():
    return jsonify({'data':'Hello world'})