from .request_helper import get
from .cache import cache, song_cache, CACHE_TIMEOUT

ARTIST_API = 'https://conuhacks-playback-api.touchtunes.com/artist/{}'
SONG_API = 'https://conuhacks-playback-api.touchtunes.com/song/{}'

def fetch_artist_name(artist_id, obj):
    resp = get(ARTIST_API.format(artist_id))
    obj['artistName'] = resp['artistName']
    cache.set(artist_id, resp['artistName'], CACHE_TIMEOUT)
    return resp['artistName']

def fetch_song_name(song_id, obj):
    resp = get(SONG_API.format(song_id))
    obj['songTitle'] = resp['songTitle']
    cache.set(song_id, resp['songTitle'], CACHE_TIMEOUT)
    return resp['songTitle']


