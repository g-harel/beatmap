from marshmallow import Schema, fields, validate
from datetime import date

class PlaysCoordinatesSchema(Schema):
    lat = fields.Float(required=True)
    long = fields.Float(required=True)


class PlaysRequestSchema(Schema):
    start_date = fields.DateTime(required=True)
    end_date   = fields.DateTime(required=True)
    coordinates = fields.Nested(PlaysCoordinatesSchema, many=True)