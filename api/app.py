from flask import Flask, jsonify
from flask import request
import diff_data
import location_color as lc

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

@app.route("/calc")
def calc():
    return diff_data.calc_consump(data)

@app.route("/color", methods=['POST'])
def give_color() :
    json_data = request.get_json()  # parse JSON body
    if not json_data or "time" not in json_data:
        return jsonify({"error": "Missing 'time' field"}), 400

    time_value = json_data["time"]
    return lc.get_color_json(data, str(time_value))