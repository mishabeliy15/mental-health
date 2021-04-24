import json
from time import sleep

import requests
import random
from datetime import datetime

with open("config.json", "r") as file:
    SETTINGS = json.load(file)


TOKEN = SETTINGS["token"]
BASE_PULSE = SETTINGS["base"]
URL = SETTINGS["url"]
MIN_PULSE = SETTINGS["min"]
MAX_PULSE = SETTINGS["max"]


def send_request(pulse) -> bool:
    headers = {"Authorization": f"Bearer {TOKEN}"}
    response = requests.post(URL, json={"pulse": pulse}, headers=headers)
    return response.ok


def main():
    variances = ((1, 1, -1), (1, -1, -1))
    variance = (1, 1, -1)
    pulse = SETTINGS["base"]
    while True:
        if pulse > MAX_PULSE:
            variance = variances[1]
        elif pulse < MIN_PULSE:
            variance = variances[0]
        sign = random.choice(variance)
        pulse += sign * random.randint(1, 10)
        is_ok = send_request(pulse)
        now = datetime.now()
        print(f"[{now.strftime('%H:%M:%S')}] Pulse: {pulse}; Request is ok: {is_ok}")
        sleep(1)


if __name__ == "__main__":
    main()
