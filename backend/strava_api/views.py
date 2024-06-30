import requests
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import StravaAccessToken, StravaRefreshToken
from .serializers import StravaGetTokenSerializer
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone
from datetime import timedelta
from backend.settings import CLIENT_ID, CLIENT_SECRET, SCOPE
from .utils import refresh_token

@api_view(['GET'])
def strava_get_access(request):
    user = request.user
    
    # TODO: Use Serializer
    redirect_uri = request.GET.get('redirect_uri')
    print(redirect_uri)
    if not redirect_uri:
        return Response({'error': 'redirect_uri is required'}, status=400)
    
    strava_auth_url = (
        f"https://www.strava.com/oauth/authorize?client_id={CLIENT_ID}"
        f"&redirect_uri={redirect_uri}" # Make sure to update Strava callback domain
        "&response_type=code"
        f"&scope={SCOPE}"
    )

    # Check which if user have authorise Strava before
    if not StravaAccessToken.objects.filter(user=user).exists() or not StravaRefreshToken.objects.filter(user=user).exists():
        return Response({'strava_auth_url': strava_auth_url}, status=status.HTTP_200_OK)
    
    # Happy path refresh token
    refresh_token(user)
    return Response({'status': 'success'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def strava_get_token(request):
    serializer = StravaGetTokenSerializer(data=request.GET)
    if serializer.is_valid():
        code = request.GET.get('code')
        token_response = requests.post(
            'https://www.strava.com/oauth/token',
            data={
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
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
   

