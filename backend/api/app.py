from flask import Flask, jsonify
from flask import request
from flask_cors import CORS
import diff_data
import aiProvider
import aiCustomer
import os
import openai
import model.xlstm_runner
from model.xlstm_runner import m_eval

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI(api_key=OPENAI_API_KEY)

GAUSS_LOOKUP = [425, 428.29, 500, 428.29, 425]
CALC_DATA_JSON = "/opt/data/calc.json"
METER_TO_LOCATION = "/opt/data/daniel_data/meter_to_location.json"
TOTAL_CONSUMPTION_JSON = "/opt/data/daniel_data/location_total_consumption.json"

app = Flask(__name__)
CORS(app)

import json
data = {}
# Opening JSON file
with open(diff_data.DATA_JSON_FILE) as json_file:
    data:dict = json.load(json_file)

keys = list(data.keys())

consumption_data = {}
# Opening JSON file
with open(TOTAL_CONSUMPTION_JSON) as json_file:
    consumption_data:dict = json.load(json_file)


calc_data = {}
with open(CALC_DATA_JSON) as json_file:
    calc_data:dict = json.load(json_file)

meter_data = {}
with open(METER_TO_LOCATION) as json_file:
    meter_data:dict = json.load(json_file)

ai_data = aiProvider.get_location_energy_data(data, meter_data)

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
    print(hour, type(hour))
    try:
        hour = int(hour)
    except Exception:
        return jsonify({"error": "error"}), 400

    
    if 7 <= hour <= 11:
        hour -= 7
        return {"price": GAUSS_LOOKUP[hour]}
    if 18 <= hour <= 22:
        hour -= 18
        return {"price": GAUSS_LOOKUP[hour]}

    return {"price": GAUSS_LOOKUP[2]}


@app.route("/color", methods=['POST'])
def give_color() :
    json_data = request.get_json()  # parse JSON body
    if not json_data or "time" not in json_data:
        return jsonify({"error": "Missing 'time' field"}), 400

    time_value = json_data["time"]
    return diff_data.get_color_json(data, str(time_value))

@app.route("/region/all")
def get_regions():
    return calc_data

@app.route("/ai")
def get_ai_resp():
    return aiProvider.get_ai_recommendations(client, ai_data)

@app.route("/ai/chat", methods=['POST'])
def chat_q():
    json_data = request.get_json()  # parse JSON body
    if not json_data or "message" not in json_data:
        return jsonify({"error": "Missing 'message' field"}), 400
    
    message = json_data["message"]
    return {"response": aiCustomer.get_ai_response(client, message)}

@app.route("/consumptions")
def give_consumption():
    return consumption_data

@app.route("/pred/week")
def w_pred():
    return m_eval(week=True)

@app.route("/pred")
def pred():
    return m_eval()