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
            radius = float(request.GET.get('radius')) * 1000 # Convert to km
            location = Location(request.GET.get('address'), radius)
        except(InvalidSearchError):
            context = { 
                "message_p1": "Invalid Search.", 
                "message_p2": "Please refine your search."
            }
            return render(request, "error.html", context)
        
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
            context = { 
                "message_p1": "No nearby parks found.", 
                "message_p2": "Please refine your search."
            }
            return render(request, "error.html", context) 
        except(NoNearbyGymFound):
            context = { 
                "message_p1": "No nearby gyms found.", 
                "message_p2":  "Please refine your search."
            }
            return render(request, "error.html", context) 
        except:
            context = { 
                "message_p1": "Please refine your search.", 
                "message_p2": ""
            }
            return render(request, "error.html", context) 

        context = {
            "type" : type,
            "landmarks_json" : landmarks_json,
            "initial_lat" : location.lat,
            "initial_lng" : location.lon,
            "address" : location.address,
        }
        return render(request, "findNearest.html", context)
    else:
        # With the frontend form validation in place
        # This section should never be reached 
        context = { 
            "message_p1": "Invalid Query.", 
            "message_p2": ""
        }
        return render(request, "error.html", context)


