from flask import Flask, render_template, request, redirect, url_for, make_response, session
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore, login_required
from flask_restful import Api
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
db = SQLAlchemy()

from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired
class MyForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])

def create_app():
    from .models.user import get_datastore

    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)


    configure_app(app)

    db.init_app(app)
    security = Security(app, get_datastore())
    #CSRFProtect(app)
    api = Api(app)

    @app.route('/profile')
    @login_required
    def profile():
        from flask import g
        return render_template('profile.html')

    from .views.user import UserCreateView
    api.add_resource(UserCreateView, "/register")

    # @app.route('/register', methods=['POST', 'GET'])
    # def register():
    #     from flask import g
    #     if request.method == 'POST':
    #         get_datastore().create_user(
    #             email=request.form.get('email'),
    #             password=hash_password(request.form.get('password'))
    #         )
    #         db.session.commit()
    #
    #         return redirect(url_for('profile'))
    #
    #     return render_template('register.html', form=MyForm())
    #
    #     # resp = make_response(render_template('register.html', form=MyForm()))
    #     # resp.set_cookie('csrf-token', session['csrf_token'])
    #     # return resp

    return app

def configure_app(app):  # pragma: no cover
    from src.config import Config
    app.config.from_object(Config)

    app.config["SECURITY_CSRF_COOKIE"] = {"key": "XSRF-TOKEN"}
    app.config["WTF_CSRF_TIME_LIMIT"] = None

    # You can't get the cookie until you are logged in.
    app.config["SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS"] = True