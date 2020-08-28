from flask_restful import Resource
from flask import request
from flask_security import current_user, auth_required

from .. import db
from ..models.article import Article
from ..schema.article import ArticleSchema
from ..utils.response_format import build_data_response


class MultipleArticleView(Resource):
    @auth_required()
    def post(self):
        schema = ArticleSchema()
        errors = schema.validate(request.form, session=db.session)
        if errors:
            return errors, 400

        content = request.form.get("content")
        article = Article(content=content, user_id=current_user.id)
        db.session.add(article)
        db.session.commit()
        return build_data_response({"id": article.id}, 200)

    @auth_required()
    def get(self):
        schema = ArticleSchema()
        articles = db.session.query(Article).filter_by(user_id=current_user.id)
        return build_data_response(schema.dump(articles, many=True), 200)


class ArticleGetView(Resource):
    @auth_required()
    def get(self, id):
        article = db.session.query(Article).filter_by(id=id).first()
        if not article:
            return "Not found.", 404
        return {"id": article.id, "content": article.content}, 200
