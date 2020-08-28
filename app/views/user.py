from flask_restful import Resource
from flask_security import current_user
from ..utils.response_format import build_data_response

class UserGetView(Resource):
    def get(self):
        if current_user.is_anonymous:
            response = build_data_response({"user_id": None, "username": None, "email": None}, 200)
        else:
            response = build_data_response({
                "user_id": current_user.id,
                "username": current_user.username,
                "email": current_user.email,
            },
            200,)
        return response

