import json
from time import sleep

import requests
import random

with open("config.json", "r") as file:
    SETTINGS = json.load(file)


TOKEN = SETTINGS["token"]
BASE_PULSE = SETTINGS["base"]
URL = SETTINGS["url"]


def send_request(pulse):
    headers = {"Authorization": f"Bearer {TOKEN}"}
    requests.post(URL, json={"pulse": pulse}, headers=headers)


def main():
    variance = (1, 1, -1)
    pulse = SETTINGS["base"]
    while True:
        sign = random.choice(variance)
        pulse += sign * random.randint(1, 10)
        print(f"Pulse: {pulse}")
        send_request(pulse)
        sleep(1)


if __name__ == "__main__":
    main()
