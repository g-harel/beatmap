from flask import Blueprint, jsonify, session, request
from schema import plays
from mocks import mocks
from helpers.plays_helper import fetch_artist_name
from helpers.cache import cache, CACHE_TIMEOUT
from helpers.big_query_helper import client
from google.cloud import bigquery

plays_blueprint_name = 'plays'
plays_route = Blueprint(plays_blueprint_name, __name__, url_prefix='/{}'.format(plays_blueprint_name))


@plays_route.route('', methods=['POST'])
def plays_data():
    request_data, err = plays.PlaysRequestSchema().load(request.get_json(force=True))
    if err:
        return jsonify({'data':{}, 'error': err})

    for play in mocks.data["plays"]:
        # check if cached
        cached_data = cache.get(play['artistId'])
        if cached_data is None:
            artist_name = fetch_artist_name(play['artistId'])
            play['artist_name'] = artist_name
            # cache it :)
            cache.set(play['artistId'], artist_name, CACHE_TIMEOUT)
    return jsonify({'data': mocks.data})


@plays_route.route('', methods=['GET'])
def get_plays():
    query = (
        "SELECT state FROM `conuhacks2019-229901.plays.*` LIMIT 100"
    )
    query_job = client.query(
        query,
        # Location must match that of the dataset(s) referenced in the query.
        location="US",
    )  # API request - starts the query

    res = query_job.result()
    data = plays.Res(many=True).load(res)

    return jsonify({'data':data})


@plays_route.route('/top', methods=['POST'])
def get_top_song():
    request_data, err = plays.PlaysRequestSchema().load(request.get_json(force=True))

    arr = [[[-111.302490234375, 40.622291783092706], [-103.65600585937499, 40.622291783092706],
      [-103.65600585937499, 45.251688256117646], [-111.302490234375, 45.251688256117646],
      [-111.302490234375, 40.622291783092706]]]

    geo_from_json = {"type": "Polygon", "coordinates": arr}
    query = (
        """
    SELECT songId, COUNT(songId) as count FROM `conuhacks2019-229901.plays.*`
    WHERE ST_DWITHIN(ST_GEOGPOINT(longitude, latitude), ST_GEOGFROMGEOJSON(@s), 0)
    GROUP BY songId ORDER BY count DESC LIMIT 10 """
    )
    query_params = [
        bigquery.ScalarQueryParameter(
            's', 'STRING', str(geo_from_json))
        ]

    job_config = bigquery.QueryJobConfig()
    job_config.query_parameters = query_params

    query_job = client.query(
        query,
        # Location must match that of the dataset(s) referenced in the query.
        location="US",
        job_config=job_config
    )  # API request - starts the query

    res = query_job.result()
    data = plays.Res(many=True).load(res)

    return jsonify({'data':data})