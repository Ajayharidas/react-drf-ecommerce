from django.conf import settings
import requests
import logging


logger = logging.getLogger(__name__)

base_url = settings.BASE_URL


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

    response = requests.post(url, data=payload, headers=headers)
    return response


def google_get_user(access_token: str) -> str:
    payload = {
        "grant_type": "convert_token",
        "token": access_token,
        "client_id": settings.CLIENT_ID,
        "backend": "google-oauth2",
    }
    url = f"{base_url}/auth/convert-token/"
    headers = {"Content-Type": "application/json"}

    response = requests.post(url, json=payload, headers=headers)
    return response
