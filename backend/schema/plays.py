from marshmallow import Schema, fields, validate
from datetime import date

class PlaysCoordinatesSchema(Schema):
    lat = fields.Float(required=True)
    long = fields.Float(required=True)


class PlaysRequestSchema(Schema):
    start_date = fields.DateTime()
    end_date   = fields.DateTime()


class Res(Schema):
    state = fields.String()
    count = fields.Integer()
    playDate =  fields.DateTime()
    artistId = fields.Integer()
    songId = fields.Integer()
    style = fields.String()
    latitude = fields.Float()
    longitude = fields.Float()