from flask import Flask, jsonify
from flask import request
import diff_data

GAUSS_LOOKUP = [425, 428.29, 500, 428.29, 425]

app = Flask(__name__)

import json
data = {}
# Opening JSON file
with open('../data/data.json') as json_file:
    data:dict = json.load(json_file)

keys = list(data.keys())

@app.route("/id/<id>")
def hello(id):
    return data[str(id)]

@app.route("/diff/<id>")
def diffs(id):
    return diff_data.get_diffs(data[str(id)])

@app.route("/")
@app.route("/keys")
def keys_route():
    return keys

# @app.route("/calc")
# def calc():
#     return diff_data.calc_consump(data)

## 7->11, 18->22

@app.route("/tarrif/<hour>")
def tarrif(hour):
    if 7 <= hour <= 11:
        hour -= 7
        return GAUSS_LOOKUP[hour]
    if 18 <= hour <= 22:
        hour -= 18
        return GAUSS_LOOKUP[hour]

    return GAUSS_LOOKUP[2]

@app.route("/color", methods=['POST'])
def give_color() :
    json_data = request.get_json()  # parse JSON body
    if not json_data or "time" not in json_data:
        return jsonify({"error": "Missing 'time' field"}), 400

    time_value = json_data["time"]
    return diff_data.get_color_json(data, str(time_value))