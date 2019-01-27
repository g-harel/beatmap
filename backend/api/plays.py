from flask import Blueprint, jsonify, session, request
from schema import plays
from mocks import mocks
from helpers.plays_helper import fetch_artist_name

plays_blueprint_name = 'plays'
plays_route = Blueprint(plays_blueprint_name, __name__, url_prefix='/{}'.format(plays_blueprint_name))


@plays_route.route('', methods=['POST'])
def reset_data():
    request_data, err = plays.PlaysRequestSchema().load(request.get_json(force=True))
    if err:
        return jsonify({'data':{}, 'error': err})

    for play in mocks.data["plays"]:
        artist_name = fetch_artist_name(play['artistId'])
        play['artist_name'] = artist_name

    return jsonify({'data': mocks.data})