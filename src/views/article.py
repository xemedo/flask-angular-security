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
            return 'No content.', 400

        article = Article(content=content, user_id=current_user.id)
        db.session.add(article)
        db.session.commit()
        return {'id': article.id}, 200

class ArticleGetView(Resource):
    @login_required
    def get(self, id):
        article = db.session.query(Article).filter_by(id=id).first()
        if not article:
            return 404, 'Not found.'
        return {'id': article.id, 'content': article.content}, 200