from .. import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    is_user_active = db.Column(db.Boolean, default=True)
    confirmed_at = db.Column(db.DateTime)

    @property
    def is_active(self):
        return self.is_user_active

    @property
    def is_authenticated(self):
        return self.is_confirmed

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)