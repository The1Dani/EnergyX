from flask import Flask
import diff_data

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
