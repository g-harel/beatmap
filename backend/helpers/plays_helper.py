from .request_helper import get

SECRET = ''
ARTIST_API = 'https://conuhacks-playback-api.touchtunes.com/artist/{}'


def fetch_artist_name(artist_id):
    resp = get(ARTIST_API.format(artist_id))
    return resp['artistName']


