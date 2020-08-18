from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security
from flask_restful import Api
from flask_cors import CORS
from src.forms.flask_security_extensions import *

import flask_wtf


app = Flask(__name__)
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

    # Enable CSRF protection
    flask_wtf.CSRFProtect(app)
    security = Security(app, user_datastore, confirm_register_form=ExtendedRegisterForm, login_form=ExtendedLoginForm)
    init_login(security)

def create_app():

    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)


    configure_app(app)

    db.init_app(app)
    api = Api(app)
    configure_flask_security(app)
    CORS(app, resources={r"/*": {"origins": "*"}})

    from .views.article import ArticleCreateView, ArticleGetView

    api.add_resource(ArticleCreateView, "/articles")
    api.add_resource(ArticleGetView, "/articles/<id>")

    return app

def configure_app(app):  # pragma: no cover
    from src.config import Config
    app.config.from_object(Config)