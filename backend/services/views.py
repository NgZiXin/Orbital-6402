from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import FindNearestSerializer, WebviewSerializer
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render
from haversine import haversine, Unit
import overpy

# Create your views here.

@api_view(['GET'])
@permission_classes([AllowAny])
def index(request):
    serializer = WebviewSerializer(data=request.GET)
    if serializer.is_valid():
        context = {
            "type" : request.GET.get('type'),
            "url" : request.build_absolute_uri(request.path),
            "initial_lat" : request.GET.get('lat'),
            "initial_lng" : request.GET.get('lon'),
            "radius" : request.GET.get('radius'),
        }
        return render(request, "findNearest.html", context)
    else:
        return render(request, "noSearch.html")

@api_view(['GET'])
@permission_classes([AllowAny])
def find_nearest_gyms(request):
    serializer = FindNearestSerializer(data=request.GET)
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
                    gym = {
                        "name": node.tags.get("name","Gym (Name NOT FOUND)"), 
                        "latitude": node.lat,
                        "longitude": node.lon,
                        "distance": "{:.2f}".format(haversine((float(lat),float(lon)),(float(node.lat),float(node.lon)),unit=Unit.KILOMETERS)),
                        "image": f"https://www.onemap.gov.sg/api/staticmap/getStaticImage?layerchosen=grey&latitude={node.lat}&longitude={node.lon}&zoom=18&width=386&height=200&points=[{node.lat},{node.lon}]"
                    }
                    gyms.append(gym)
            return Response(gyms, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])   
def find_nearest_parks(request):
    serializer = FindNearestSerializer(data=request.GET)
    if serializer.is_valid():
        lat = request.GET.get('lat')
        lon = request.GET.get('lon')
        radius = request.GET.get('radius')
        api = overpy.Overpass()
        
        # Query to find parks within the specified radius
        query = f"""
        [out:json];
        node
        ["leisure"="park"]
        (around:{radius},{lat},{lon});
        out body;
        """
        
        try:
            result = api.query(query)
            parks = []
            if result.nodes:
                for node in result.nodes:
                    name = node.tags.get("name", None)
                    if name:
                        park = {
                            "name": name, 
                            "latitude": node.lat,
                            "longitude": node.lon,
                            "distance": "{:.2f}".format(haversine((float(lat),float(lon)),(float(node.lat),float(node.lon)),unit=Unit.KILOMETERS)),
                            "image": f"https://www.onemap.gov.sg/api/staticmap/getStaticImage?layerchosen=grey&latitude={node.lat}&longitude={node.lon}&zoom=18&width=386&height=200&points=[{node.lat},{node.lon}]"
                        }
                        parks.append(park)
            print(parks)
            return Response(parks, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response(serializer.errors, status=400)

