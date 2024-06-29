import requests
from .models import StravaAccessToken, StravaRefreshToken
from django.utils import timezone
from datetime import timedelta
from backend.settings import CLIENT_ID, CLIENT_SECRET

def refresh_token(user):
    # Check if no token
    if not StravaAccessToken.objects.filter(user=user).exists() or not StravaRefreshToken.objects.filter(user=user).exists():
        return None
    
    strava_access_token = StravaAccessToken.objects.get(user=user)
    strava_refresh_token = StravaRefreshToken.objects.get(user=user)
    
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

def get_token(user):
    # Check if no token
    if not StravaAccessToken.objects.filter(user=user).exists() or not StravaRefreshToken.objects.filter(user=user).exists():
        return None
    
    strava_access_token = StravaAccessToken.objects.get(user=user)
    if strava_access_token.expires_at < timezone.now():
        refresh_token(user)
        strava_access_token = StravaAccessToken.objects.get(user=user)
    
    return strava_access_token.access_token