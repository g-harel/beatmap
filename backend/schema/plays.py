from marshmallow import Schema, fields, validate
from datetime import date

class PlaysCoordinatesSchema(Schema):
    lat = fields.Float(required=True)
    long = fields.Float(required=True)


class PlaysRequestSchema(Schema):
    start_date = fields.DateTime()
    end_date   = fields.DateTime()
    coordinates = fields.Nested(PlaysCoordinatesSchema, many=True)


class Res(Schema):
    state = fields.String()
    playDate =  fields.DateTime()
    artistId = fields.Integer()
    songId = fields.Integer()
    style = fields.DateTime()
    latitude = fields.Float()
    longitude = fields.Float()