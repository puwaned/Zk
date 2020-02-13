from flask import request
from flask import Flask
from flask_cors import CORS
import subprocess
import json
import re
import sys
import signal
import os

cfg = {
    "app_location": os.getcwd()
}

def handler(signal, frame):
    sys.exit(0)


def get_file():
    subprocess.call(
        "cd " + cfg["app_location"] + "/client/client/bin/Debug/ &&\
        client.exe SUWAT", shell=True)
    with open(cfg["app_location"]+'/client/client/bin/Debug/result.txt') as f:
        data = f.read()
    return data
        


app = Flask(__name__)
CORS(app)


@app.route("/get", methods=["GET"])
def create_secret():
    result = get_file()
    return json.dumps({'result':result})



if __name__ == "__main__":
    app.run(debug=True)

