from flask_restful import Resource
from flask_security import current_user


class UserGetView(Resource):
    def get(self):
        if current_user.is_anonymous:
            return {"user_id": None, "username": None, "email": None}, 200

        return (
            {
                "user_id": current_user.id,
                "username": current_user.username,
                "email": current_user.email,
            },
            200,
        )
