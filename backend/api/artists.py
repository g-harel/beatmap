from flask import Blueprint, jsonify, session, request
from schema import plays
from mocks import mocks
from helpers.plays_helper import fetch_artist_name,fetch_song_name
from helpers.cache import cache, song_cache, CACHE_TIMEOUT
from helpers.big_query_helper import client
from google.cloud import bigquery
from threading import Thread


artists_blueprint_name = 'artists'
artists_route = Blueprint(artists_blueprint_name, __name__, url_prefix='/{}'.format(artists_blueprint_name))


@artists_route.route('/<int:artistId>', methods=['GET'])
def get_top_coordinates_for_song(artistId):
    query = (
        """
    SELECT songId, longitude, latitude, COUNT(songId) as count FROM `conuhacks2019-229901.plays.*`
    WHERE artistId = @artistId
    GROUP BY longitude, latitude, songId
    ORDER BY count DESC LIMIT 10 """
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