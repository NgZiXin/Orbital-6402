import requests
import os
from datetime import datetime
from backend.utils import convert_unix_to_singapore_time
from .models import OneMapApi

def get_access_token():
    obj = OneMapApi.objects.first()

    if not obj or obj.expiry_date < datetime.now(obj.expiry_date.tzinfo):
        url = "https://www.onemap.gov.sg/api/auth/post/getToken"
      
        payload = {
                "email": os.environ['ONEMAP_EMAIL'],
                "password": os.environ['ONEMAP_EMAIL_PASSWORD']
            }
            
        response = requests.request("POST", url, json=payload)

        if not response.ok:
             raise Exception("Invalid OneMap Api Account details")
        
        response_json = response.json()
        obj, created = OneMapApi.objects.get_or_create(
            id=1,
            defaults={"access_token" : response_json.get("access_token"),
                      "expiry_date" : convert_unix_to_singapore_time(float(response_json.get("expiry_timestamp")))
                      }
        )
        
        if not created:
            obj.access_token=response_json.get("access_token")
            obj.expiry_date=convert_unix_to_singapore_time(float(response_json.get("expiry_timestamp")))
            obj.save()

    return obj.access_token
