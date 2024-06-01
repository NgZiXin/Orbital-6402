import requests
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import StravaAccessToken, StravaRefreshToken
from .serializers import StravaGetTokenSerializer
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import redirect
from django.utils import timezone
from datetime import timedelta
from backend.settings import CLIENT_ID, CLIENT_SECRET, SCOPE, REDIRECT_URI

@api_view(['GET'])
@permission_classes([AllowAny])
def strava_get_access(request):
    strava_auth_url = (
        f"https://www.strava.com/oauth/authorize?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&response_type=code"
        f"&scope={SCOPE}"
    )
    return redirect(strava_auth_url)

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
        print(code)

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

@api_view(['GET'])
def strava_refresh_token(request):
    user = request.user

    # Check bad info
    if not StravaAccessToken.objects.filter(user=user).exists() or not StravaRefreshToken.objects.filter(user=user).exists():
        return Response({'error': 'Exisitng strava token not found'}, status=status.HTTP_404_NOT_FOUND)

    strava_access_token = StravaAccessToken.objects.get(user=user)
    strava_refresh_token = StravaRefreshToken.objects.get(user=user)
    
    if strava_access_token.expires_at < timezone.now():
        # Refresh the token
        token_url = 'https://www.strava.com/oauth/token'
        payload = {
            'client_id':CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'grant_type': 'refresh_token',
            'refresh_token': strava_refresh_token.refresh_token,
        }
        token_response = requests.post(token_url, data=payload)
        
        # Obtain data
        token_json = token_response.json()

        # Save user data in tables
        strava_access_token = StravaAccessToken.objects.get(user=user)
        strava_access_token.access_token = token_json.get('access_token')
        strava_access_token.expires_at = timezone.now() + timedelta(seconds=token_json.get('expires_in'))
        strava_access_token.save()
        strava_refresh_token = StravaRefreshToken.objects.get(user=user)
        strava_refresh_token.refresh_token = token_json.get('refresh_token')
        strava_refresh_token.save()
    return Response({'status': 'success'}, status=status.HTTP_200_OK)
