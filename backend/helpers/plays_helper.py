from .request_helper import get
from .cache import cache, song_cache, CACHE_TIMEOUT

ARTIST_API = 'https://conuhacks-playback-api.touchtunes.com/artist/{}'
SONG_API = 'https://conuhacks-playback-api.touchtunes.com/song/{}'

def fetch_artist_name(artist_id, obj):
    resp = get(ARTIST_API.format(artist_id))

    if not resp:
        obj['artistName'] = 'Unknown'
    else:
        obj['artistName'] = resp['artistName']
    cache.set(artist_id, obj['artistName'], CACHE_TIMEOUT)


def fetch_song_name(song_id, obj):
    resp = get(SONG_API.format(song_id))
    if resp is None:
        obj['songTitle'] = 'Unknown'
    else:
        print(resp['songTitle'])
        obj['songTitle'] = resp['songTitle']
    cache.set(song_id, obj['songTitle'], CACHE_TIMEOUT)


