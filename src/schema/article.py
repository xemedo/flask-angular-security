from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import validates, ValidationError
from src.models.article import Article


class ProductSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Article
        load_instance = True

    @validates('content')
    def validate_content_length(self, value):
        '''
        Dont allow text that has less than 10 characters.
        :param value:
        :return:
        '''
        if len(value) < 10 or value.isspace():
            raise ValidationError('Content is not valid.')
