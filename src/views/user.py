from flask_restful import Resource
from flask import request

from werkzeug.security import generate_password_hash
from ..models.user import get_datastore
from .. import db

class UserCreateView(Resource):
    def post(self):
        get_datastore().create_user(
            email=request.form.get('email'),
            password=generate_password_hash(request.form.get('password'))
        )
        db.session.commit()

        return 200