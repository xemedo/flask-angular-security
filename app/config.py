import os


class Config(object):
    basedir = os.path.abspath(os.path.dirname(__file__))
    SECRET_KEY = "dev-key"
    SECURITY_PASSWORD_SALT = "security-password-salt"
    SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ENV = "development"
    SERVER_NAME = "localhost:5000"
    SECURITY_PASSWORD_SALT = "security-password-salt"
