from main import db
from flask_security import Security, SQLAlchemyUserDatastore
from flask_security import UserMixin, RoleMixin

users_roles = db.Table("roles_users",
                       db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
                       db.Column("role_id", db.Integer, db.ForeignKey("role.id"))
                       )
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean)
    confirmed_at = db.Column(db.DateTime)
    roles = db.relationship(
        'Role',
        secondary=users_roles,
        backref=db.backref('users', lazy='dynamic')
    )

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.String(255))

user_datastore = SQLAlchemyUserDatastore(db, User, Role)

def get_datastore():
    return user_datastore