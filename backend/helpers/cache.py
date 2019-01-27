from werkzeug.contrib.cache import SimpleCache

CACHE_TIMEOUT = 60 * 60 * 6
cache = SimpleCache()
song_cache = SimpleCache()
