from flask import Blueprint, jsonify, session, request
from schema import plays
from mocks import mocks
from helpers.plays_helper import fetch_artist_name,fetch_song_name
from helpers.cache import cache, song_cache, CACHE_TIMEOUT
from helpers.big_query_helper import client
from google.cloud import bigquery
from threading import Thread

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


@plays_route.route('/top', methods=['POST'])
def get_top_songs():
    request_data = request.get_json(force=True)
    arr = [request_data['coordinates']]

    geo_from_json = {"type": "Polygon", "coordinates": arr}
    query = (
        """
    SELECT songId, artistId, COUNT(playDate), style, COUNT(songId) as count FROM `conuhacks2019-229901.plays.*`
    WHERE ST_DWITHIN(ST_GEOGPOINT(longitude, latitude), ST_GEOGFROMGEOJSON(@s), 0)
    GROUP BY songId, artistId, style ORDER BY count DESC LIMIT 10 """
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
    songs = plays.Res(many=True).load(res)[0]
    thread_pool = []

    for song in songs:
        # check if cached
        cached_data = cache.get(song['artistId'])
        if cached_data is None:
            thread = Thread(target=fetch_artist_name, args=[song['artistId'],song])
            thread_pool.append(thread)
            thread.start()

    thread_pool.append(thread)
    for thread in thread_pool:
        thread.join()

    # clear the pool for next async operations
    thread_pool = []
    for song in songs:
        cached_data = song_cache.get(song['songId'])
        if cached_data is None:
            thread = Thread(target=fetch_song_name, args=[song['songId'], song])
            thread_pool.append(thread)
            thread.start()

    thread_pool.append(thread)
    for thread in thread_pool:
        thread.join()

    return jsonify({'data': songs})


@plays_route.route('/<int:artistId>', methods=['GET'])
def get_top_coordinates(artistId):
    query = (
        """
    SELECT COUNT(playDate), longitude, latitude, COUNT(songId) as count FROM `conuhacks2019-229901.plays.*`
    WHERE artistId = @artistId
    GROUP BY longitude, latitude, style ORDER BY count DESC LIMIT 10 """
    )

    query_params = [
        bigquery.ScalarQueryParameter(
            'artistId', 'INT64', artistId)
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
    styles = plays.Res(many=True).load(res)[0]

    return jsonify({'data': styles})