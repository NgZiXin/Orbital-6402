import requests
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import StravaAccessToken, StravaRefreshToken
from .serializers import StravaGetTokenSerializer
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone
from datetime import timedelta
from .utils import refresh_token
import os

@api_view(['GET'])
def strava_check_auth(request):
    user = request.user
    response = {"CLIENT_ID":  os.environ.get("STRAVA_CLIENT_ID"), "status": "Failed" }
    if StravaAccessToken.objects.filter(user=user).exists() or StravaRefreshToken.objects.filter(user=user).exists():
            refresh_token(user)
            response["status"] = "Success"
            return Response(response, status=status.HTTP_200_OK)
    return Response(response, status=status.HTTP_200_OK)


@api_view(['GET'])
def strava_get_token(request):
    serializer = StravaGetTokenSerializer(data=request.GET)
    if serializer.is_valid():
        code = request.GET.get('code')
        token_response = requests.post(
            'https://www.strava.com/oauth/token',
            data={
                'client_id': os.environ.get("STRAVA_CLIENT_ID"),
                'client_secret': os.environ.get("STRAVA_CLIENT_SECRET"),
                'code': code,
                'grant_type': 'authorization_code',
            }
        )

        # Obtain data
        token_json = token_response.json()

        # Save user data in tables
        user = request.user

        # Get or create the StravaAccessToken with defaults
        strava_access_token, created = StravaAccessToken.objects.get_or_create(user=user)
        strava_access_token.access_token = token_json.get('access_token')
        strava_access_token.expires_at = timezone.now() + timedelta(seconds=token_json.get('expires_in'))
        strava_access_token.set_scope(token_json.get('scope'))
        strava_access_token.save()
        
        # Get or create the StravaRefreshToken with defaults
        strava_refresh_token, created = StravaRefreshToken.objects.get_or_create(user=user)
        strava_refresh_token.refresh_token = token_json.get('refresh_token')
        strava_refresh_token.save()

        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid Query'}, status=400)
   

