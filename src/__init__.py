from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security
from flask_restful import Api
from flask_cors import CORS
from src.forms.flask_security_extensions import *
import flask_wtf

class InvalidHTTPHeader(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

db = SQLAlchemy()


def init_login(security):
    @security.login_manager.unauthorized_handler
    def unauth_handler():
        return 'Please log in to access this page.', 401

def reinit_db(app):
    with app.app_context():
        db.drop_all()
        db.create_all()

def configure_flask_security(app):
    from .models.user import user_datastore
    # send CSRF cookie with the following key name
    app.config["SECURITY_CSRF_COOKIE"] = {"key": "XSRF-TOKEN"}

    # Don't have csrf tokens expire (they are invalid after logout)
    app.config["WTF_CSRF_TIME_LIMIT"] = None

    # don't return the CSRF cookie until user is logged in
    app.config["SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS"] = True

    # disable WTF CSRF check since flask-security implements its own measures
    app.config["WTF_CSRF_CHECK_DEFAULT"] = False

    # allow login using username or email
    app.config["SECURITY_USER_IDENTITY_ATTRIBUTES"] = ["email", 'username']

    # allow registration of users
    app.config['SECURITY_REGISTERABLE'] = True

    # don't send registration email as we didn't specify a provider
    app.config['SECURITY_SEND_REGISTER_EMAIL'] = False

    # for security reasons always send the same message when username or password is wrong
    app.config['SECURITY_MSG_INVALID_PASSWORD'] = ('Wrong username or password.', 'error')
    app.config['SECURITY_MSG_USER_DOES_NOT_EXIST'] = ('Wrong username or password.', 'error')

    # disable redirects because Angular has its own forms
    app.config['SECURITY_REDIRECT_BEHAVIOR'] = 'spa'

    app.config['SECURITY_UNAUTHORIZED_VIEW'] = None

    app.config['SECURITY_URL_PREFIX'] = '/api/v1'

    # Enable CSRF protection
    flask_wtf.CSRFProtect(app)
    security = Security(app, user_datastore, confirm_register_form=ExtendedRegisterForm, login_form=ExtendedLoginForm)
    init_login(security)

    @app.before_request
    def before_request_func():
        if (request.endpoint == 'security.login' or request.endpoint == 'security.register' or request.endpoint == 'security.logout') and not request.is_json:
            raise InvalidHTTPHeader('Mime type must be application/json.')


def create_app():

    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)


    configure_app(app)

    db.init_app(app)
    api = Api(app, prefix='/api/v1')
    configure_flask_security(app)

    # set only in development
    CORS(app)

    from .views.article import ArticleCreateView, ArticleGetView
    from .views.user import UserGetView

    api.add_resource(ArticleCreateView, "/articles")
    api.add_resource(ArticleGetView, "/articles/<id>")
    api.add_resource(UserGetView, "/users/current")

    @app.errorhandler(InvalidHTTPHeader)
    def handle_invalid_usage(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    return app

def configure_app(app):
    from src.config import Config
    app.config.from_object(Config)