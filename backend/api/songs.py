from flask import Blueprint, jsonify, session, request
from schema import plays
from mocks import mocks
from helpers.plays_helper import fetch_artist_name,fetch_song_name
from helpers.cache import cache, song_cache, CACHE_TIMEOUT
from helpers.big_query_helper import client
from google.cloud import bigquery
from threading import Thread


songs_blueprint_name = 'songs'
songs_route = Blueprint(songs_blueprint_name, __name__, url_prefix='/{}'.format(songs_blueprint_name))


@songs_route.route('/styles', methods=['GET'])
def get_top_coordinates_for_song():
        query = (
            """
        SELECT DISTINCT(style), longitude, latitude, COUNT(style) as count FROM `conuhacks2019-229901.plays.*`
        GROUP BY longitude, latitude, style ORDER BY count DESC LIMIT 10 """
        )

        query_job = client.query(
            query,
            # Location must match that of the dataset(s) referenced in the query.
            location="US",
        )  # API request - starts the query

        res = query_job.result()
        styles = plays.Res(many=True).load(res)[0]

        return jsonify({'data': styles})

@songs_route.route('/styles/<style_name>', methods=['GET'])
def get_top_coordinates_for_style(style_name):
        query = (
            """
        SELECT longitude, latitude, COUNT(style) as count FROM `conuhacks2019-229901.plays.*`
        WHERE style LIKE @style
        GROUP BY longitude, latitude ORDER BY count DESC LIMIT 10 """
        )

        print(style_name)
        query_params = [
            bigquery.ScalarQueryParameter(
                'style', 'STRING', str(style_name))
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