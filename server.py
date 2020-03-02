from flask import request
from flask import Flask
from flask_cors import CORS
import subprocess
import json
import re
import sys
import signal
import docker
import os

client = docker.from_env()

cfg = {
    "app_location": os.getcwd()
}

container = client.containers.run(
    "zokrates",
    "sleep infinity",
    volumes={
        cfg["app_location"] + '/code': {
            'bind': '/home/zokrates/ZoKrates/target/debug/code',
            'mode': 'rw',
        }},
    detach=True)

cfg["docker_cont_name"] = container.name


def handler(signal, frame):
    container.kill()
    sys.exit(0)


def create_hash_secret(a, b, c, d):
    command = ("docker exec -t " + cfg["docker_cont_name"] +
               " bash -c "'"cd ZoKrates/target/debug/code/get_hashes/ && /home/zokrates/zokrates compute-witness -a paramA paramB paramC paramD"'"")
    text_a = command.replace("paramA", a)
    text_b = text_a.replace("paramB", b)
    text_c = text_b.replace("paramC", c)
    result = text_c.replace("paramD", d)
    subprocess.call(result, shell=True)
    with open(cfg["app_location"] +
              '/code/get_hashes/witness', 'r') as myfile:
        data = myfile.read().replace('\n', '')
    return data


def make_witness(a, b, c, d):
    command = ("docker exec -t " + cfg["docker_cont_name"] +
               " bash -c "'"cd ZoKrates/target/debug/code/make_proof/ && /home/zokrates/zokrates compute-witness -a paramA paramB paramC paramD"'"")
    text_a = command.replace("paramA", a)
    text_b = text_a.replace("paramB", b)
    text_c = text_b.replace("paramC", c)
    text_d = text_c.replace("paramD", d)
    subprocess.call(text_d, shell=True)
    with open(cfg["app_location"] +
              '/code/make_proof/witness', 'r') as myfile:
        data = myfile.read().replace('\n', '')
    return data


def get_proof():
    subprocess.call(
        "docker exec -t " +
        cfg["docker_cont_name"] +
        " bash -c "'"cd ZoKrates/target/debug/code/make_proof/ && \
        /home/zokrates/zokrates generate-proof"'"", shell=True)
    with open(cfg["app_location"]+'/code/make_proof/proof.json') as f:
        data = json.load(f)
    return data


def setup():
    subprocess.call(
        "docker exec -t " +
        cfg["docker_cont_name"] +
        " bash -c "'"cd ZoKrates/target/debug/code/make_proof/ && \
        /home/zokrates/zokrates setup"'"", shell=True)


''' ******end of zokrates command****** '''


def check():
    subprocess.call(
        "cd " + cfg["app_location"] + "/client/client/bin/Debug/ &&\
        client.exe check_device", shell=True)
    with open(cfg["app_location"]+'/client/client/bin/Debug/check_device.txt') as f:
        data = f.read()
    return data


def verify_1():
    subprocess.call(
        "cd " + cfg["app_location"] + "/client/client/bin/Debug/ &&\
        client.exe verify_1", shell=True)
    with open(cfg["app_location"]+'/client/client/bin/Debug/finger.txt') as f:
        data = f.read()
    return data


def verify_2(finger):
    subprocess.call(
        "cd " + cfg["app_location"] + "/client/client/bin/Debug/ &&\
        client.exe verify_2 " + finger, shell=True)
    with open(cfg["app_location"]+'/client/client/bin/Debug/verify.txt') as f:
        data = f.read()
    return data


def updateVoteStatus(id):
    subprocess.call(
        "cd " + cfg["app_location"] + "/client/client/bin/Debug/ &&\
        client.exe done " + str(id), shell=True)
    with open(cfg["app_location"]+'/client/client/bin/Debug/update_status.txt') as f:
        data = f.read()
    return data


def get_secret():
    subprocess.call(
        "cd " + cfg["app_location"] + "/client/client/bin/Debug/ &&\
        client.exe get_secret_key", shell=True)
    with open(cfg["app_location"]+'/client/client/bin/Debug/secret_key.txt') as f:
        data = f.read()
    return data


app = Flask(__name__)
CORS(app)


@app.route("/create_secret", methods=["POST"])
def create_secret():
    data = json.loads(request.data)
    a = data["a"]
    b = data["b"]
    c = data["c"]
    d = data["d"]
    ref = create_hash_secret(a, b, c, d)
    s = ref[0:255]
    h1, h0 = re.search(
        r'1 .*~out', s).group()[2:-4], re.search(r'0 .*~one', s).group()[2:-4]
    r = {"h0": h0,
         "h1": h1}
    return json.dumps(r)


@app.route("/get_proofs", methods=["POST"])
def makes_witness():
    data = json.loads(request.data)
    a = data["a"]
    b = data["b"]
    c = data["c"]
    d = data["d"]
    ref = make_witness(a, b, c, d)
    s = ref[0:255]
    result = re.search(r'0 .*~one', s).group()
    proof = get_proof()
    if result in ['0 1~one']:
        return json.dumps({'result': proof})
    else:
        return json.dumps({'result': 'false'})

    ''' ******end of zokrates route****** '''


@app.route("/verify_1", methods=["GET"])
def v1():
    result = verify_1()
    return json.dumps({'result': result, 'status': 200})


@app.route("/verify_2", methods=["POST"])
def v2():
    data = json.loads(request.data)
    finger = data["finger"]
    result = verify_2(finger)
    return json.dumps({'result': result})


@app.route("/check_device", methods=["GET"])
def checks():
    result = check()
    return json.dumps({'result': result})


@app.route("/get_secret_key", methods=["GET"])
def get_secret_keys():
    result = get_secret()
    return json.dumps({'result': result})


@app.route("/done", methods=["POST"])
def dones():
    data = json.loads(request.data)
    voter_id = data["voter_id"]
    print(voter_id)
    result = updateVoteStatus(voter_id)
    return json.dumps({'result': result})


if __name__ == "__main__":
    app.run(debug=True)
