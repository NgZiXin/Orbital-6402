from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import WebviewSerializer
from .views_helper import geoCode, find_nearest_gyms, find_nearest_parks # Helper functions
from .views_helper import InvalidSearchError, NoNearbyGymFound, NoNearbyParkFound # Custom exceptions
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render
import simplejson as json

# Create your views here.

@api_view(['GET'])
@permission_classes([AllowAny])
def index(request):
    """
    Renders a map consisting nearest gym / parks. 
    An error message will be shown for invalid search query / none found nearby.
    """
    serializer = WebviewSerializer(data=request.GET)
    if serializer.is_valid():
        try:
            lat, lon, address = geoCode(request.GET.get('address'))
        except(InvalidSearchError):
            context = { "message" : "Invalid Search. Please refine your search."}
            return render(request, "error.html", context )
        
        # Get nearest gym / park
        type = request.GET.get('type')
        radius = int(request.GET.get('radius')) * 1000 # Convert to km
        landmarks_json = ""
        try:
            landmarks = []
            if type ==  "gym":
                landmarks = find_nearest_gyms(lat, lon, radius)
            else:
                landmarks = find_nearest_parks(lat, lon, radius)
            landmarks_json = json.dumps([landmark.__dict__ for landmark in landmarks])
        except(NoNearbyParkFound):
            context = { "message" : "No nearby parks found. Please refine your search."}
            return render(request, "error.html", context ) 
        except(NoNearbyGymFound):
            context = { "message" : "No nearby gyms found. Please refine your search."}
            return render(request, "error.html", context ) 
        except:
            context = { "message" : "Please refine your search."}
            return render(request, "error.html", context ) 

        context = {
            "type" : type,
            "landmarks_json" : landmarks_json,
            "initial_lat" : lat,
            "initial_lng" : lon,
            "address" : address,
        }
        return render(request, "findNearest.html", context)
    else:
        context = { "message" : "Invalid Query."}
        return render(request, "error.html", context)


