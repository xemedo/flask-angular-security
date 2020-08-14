from flask import Flask, render_template, request, redirect, url_for, make_response, session
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore, login_required
from flask_restful import Api
from flask_login import LoginManager

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

def create_app():

    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)


    configure_app(app)

    db.init_app(app)
    api = Api(app)
    login_manager.init_app(app)
    init_login()

    @app.route('/profile')
    @login_required
    def profile():
        from flask import g
        return render_template('profile.html')

    from .views.user import UserCreateView, UserLoginView
    from .views.article import ArticleCreateView, ArticleGetView

    api.add_resource(UserCreateView, "/register")
    api.add_resource(UserLoginView, "/login")
    api.add_resource(ArticleCreateView, "/articles")
    api.add_resource(ArticleGetView, "/articles/<id>")

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