class BaseConfig(object):
    DEBUG = True
    TESTING = False

    # Static files path
    CUSTOM_STATIC_PATH = 'static'

    # Session secret keys
    SECRET_KEY = 'ae24a87634bf4d749bef9d089cfcb79140d47727'
    SESSION_TYPE = 'sqlalchemy'
    SESSION_USE_SIGNER = True

    # Caching
    CACHE_TYPE = 'simple'
