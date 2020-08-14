from flask_restful import Resource
from flask import request

from werkzeug.security import generate_password_hash
from ..models.user import User
from .. import db
from werkzeug.security import check_password_hash
from flask_login import login_user

class UserCreateView(Resource):
    def post(self):
        user = User(
            email=request.form.get('email'),
            password=generate_password_hash(request.form.get('password'))
        )
        db.session.add(user)
        db.session.commit()

        return 200

class UserLoginView(Resource):
    def post(self):
        auth = request.form
        error = None
        if not auth or not auth['email'] or not auth['password']:
            return "Request data missing.", 400
        user = db.session.query(User).filter_by(email=auth['email']).first()

        if user is None:
            error = "Incorrect username or password."
        elif not check_password_hash(user.password, auth['password']):
            error = "Incorrect username or password."

        if error is None:
            remember = False
            if auth.get('remember'):
                remember = True
            # if no error but the account is not active
            if not login_user(user, remember=remember):
                error = "Your account is not active."
            else:
                return 200

        return error, 400
