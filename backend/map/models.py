from django.db import models
import requests

# Create your models here.
class OneMapApi(models.Model):
    access_token = models.CharField()
    expiry_date = models.DateTimeField()
    
    # Public Methods
    def get_footpath(self, start, end):
        # Query path using OneMap Api
        url = f"https://www.onemap.gov.sg/api/public/routingsvc/route?start={start}&end={end}&routeType=walk"
        headers = {"Authorization": self.access_token}
        response = requests.request("GET", url, headers=headers)

        if not response.ok:
            response.raise_for_status()
        
        response_json = response.json()
        return response_json.get("route_geometry"), response_json.get("route_summary").get("total_distance")
    
