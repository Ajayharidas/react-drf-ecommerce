from django.conf import settings
import requests
import logging

logger = logging.getLogger(__name__)

def google_get_tokens(data: dict) -> dict:
    payload = {
        "grant_type": data["grant_type"],
        "code": data["code"],
        "client_id": data["client_id"],
        "client_secret": data["client_secret"],
        "redirect_uri": data["redirect_uri"],
    }
    url = "https://oauth2.googleapis.com/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    response = requests.post(url, data=payload, headers=headers, timeout=300)
    return response

