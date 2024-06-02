from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import FindNearestGymSerializer
from rest_framework.decorators import api_view, permission_classes
from haversine import haversine, Unit
import overpy

# Create your views here.

@api_view(['GET'])
@permission_classes([AllowAny])
def find_nearest_gym(request):
    serializer = FindNearestGymSerializer(data=request.GET)
    if serializer.is_valid():
        lat = request.GET.get('lat')
        lon = request.GET.get('lon')
        radius = request.GET.get('radius')
        api = overpy.Overpass()
        
        # Query to find gyms within the specified radius
        query = f"""
        [out:json];
        node
        ["leisure"="fitness_centre"]
        (around:{radius},{lat},{lon});
        out body;
        """
        
        try:
            result = api.query(query)
            gyms = []
            if result.nodes:
                for node in result.nodes:
                    if node.tags["name"]: # Filter out Unnamed Gym
                        gym = {
                            "name": node.tags["name"], 
                            "latitude": node.lat,
                            "longitude": node.lon,
                            "distance": "{:.2f}".format(haversine((float(lat),float(lon)),(float(node.lat),float(node.lon)),unit=Unit.KILOMETERS))
                        }
                    gyms.append(gym)
                return Response(gyms, status=200)
            else:
                return Response({"message": "No gyms found within the specified radius."}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response(serializer.errors, status=400)

