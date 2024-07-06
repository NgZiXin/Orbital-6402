import requests
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .views_helpers import get_access_token
from .serializers import GetPathSerializer
from strava_api.views_helpers import get_token

@api_view(['GET'])
def index(request):
    user = request.user
    strava_token = get_token(user)
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

          # Query path using OneMap Api
          url = f"https://www.onemap.gov.sg/api/public/routingsvc/route?start={start}&end={end}&routeType=walk"
          headers = {"Authorization": get_access_token()}
          response = requests.request("GET", url, headers=headers)

          response_json = response.json()
          if not response.ok:
               return Response(response_json, status=400)
          
          data = {}
          data["route_geometry"] = response_json.get("route_geometry")
          data["total_distance"] = response_json.get("route_summary").get("total_distance")

          return Response(data, status=status.HTTP_200_OK)
     return Response({'status': 'error', 'message': 'Invalid Input'}, status=400)
