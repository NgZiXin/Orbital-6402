from rest_framework.permissions import AllowAny
from .serializers import WebviewSerializer
from .location import Location
from .exceptions import InvalidSearchError, NoNearbyGymFound, NoNearbyParkFound 
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
            radius = int(request.GET.get('radius')) * 1000 # Convert to km
            location = Location(request.GET.get('address'), radius)
        except(InvalidSearchError):
            context = { "message" : "Invalid Search. Please refine your search."}
            return render(request, "error.html", context )
        
        # Get nearest gym / park
        type = request.GET.get('type')
        landmarks_json = ""
        try:
            landmarks = []
            if type ==  "gym":
                landmarks = location.find_nearest_gyms()
            else:
                landmarks = location.find_nearest_parks()
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
            "initial_lat" : location.lat,
            "initial_lng" : location.lon,
            "address" : location.address,
        }
        return render(request, "findNearest.html", context)
    else:
        context = { "message" : "Invalid Query."}
        return render(request, "error.html", context)


