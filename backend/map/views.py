from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .helpers import get_onemap_api
from .serializers import GetPathSerializer
from strava_api.models import StravaToken

@api_view(['GET'])
def index(request):
     strava_token = ""
     try:
          token = StravaToken.objects.get(user=request.user)
          strava_token = token.get_token()
     except Exception:
          # User Not Authorized
          pass # TODO To make edge case more robust
     context = {
          "strava_token": strava_token,
          "url": request.build_absolute_uri(request.path)
     }
     return render(request, "routes.html", context)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_path(request):
     serializer = GetPathSerializer(data=request.GET)
     if serializer.is_valid():
          start = request.GET.get('start') 
          end = request.GET.get('end')
          
          try:
               onemap_api = get_onemap_api()
               route_geometry, total_distance = onemap_api.get_footpath(start, end)
               json = {}
               json["route_geometry"] = route_geometry
               json["total_distance"] = total_distance
               return Response(json)
          except Exception as e:
               return Response({'error': str(e)}, status=400)
          
     return Response({'error': 'Invalid Input'}, status=400)
