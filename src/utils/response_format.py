from flask import jsonify


def build_error_response(msg, code):
    data = {"meta": {"code": code}, "response": {"errors": {"email": [msg]}}}
    response = jsonify(data)
    response.status_code = code
    return response
