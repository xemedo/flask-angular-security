from flask_restful import Resource
from flask import request
from flask_login import login_required, current_user

from .. import db
from ..models.article import Article


class ArticleCreateView(Resource):
    @login_required
    def post(self):
        content = request.form.get('content')
        if not content:
            return 400, 'No content.'

        article = Article(text=content, user_id=current_user.id)
        db.session.add(article)
        db.session.commit()
        return 200

class ArticleGetView(Resource):
    @login_required
    def get(self, id):
        article = db.session.query(Article).filter_by(id=id).first()
        if not article:
            return 404, 'Not found.'
        return 200, article