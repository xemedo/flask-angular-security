from flask import Flask, render_template, request, redirect, url_for, make_response, session
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore, login_required
from flask_restful import Api
from flask_login import LoginManager

from src.forms.flask_security_extensions import *

import flask_wtf

app = Flask(__name__)
db = SQLAlchemy()
login_manager = LoginManager()

def init_login():
    from .models.user import User

    @login_manager.user_loader
    def load_user(user_id):
        return db.session.query(User).filter_by(id=user_id).first()

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

    # Enable CSRF protection
    flask_wtf.CSRFProtect(app)
    Security(app, user_datastore, confirm_register_form=ExtendedRegisterForm, login_form=ExtendedLoginForm)

def create_app():

    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)


    configure_app(app)

    db.init_app(app)
    api = Api(app)
    login_manager.init_app(app)
    init_login()
    configure_flask_security(app)

    from .views.article import ArticleCreateView, ArticleGetView

    api.add_resource(ArticleCreateView, "/articles")
    api.add_resource(ArticleGetView, "/articles/<id>")

    return app

def configure_app(app):  # pragma: no cover
    from src.config import Config
    app.config.from_object(Config)