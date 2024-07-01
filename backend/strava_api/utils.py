import requests
from .models import StravaAccessToken, StravaRefreshToken
from django.utils import timezone
from datetime import timedelta
import pytz
import os

def refresh_token(user):
    # Check if no token
    if not StravaAccessToken.objects.filter(user=user).exists() or not StravaRefreshToken.objects.filter(user=user).exists():
        return None
    
    strava_access_token = StravaAccessToken.objects.get(user=user)
    strava_refresh_token = StravaRefreshToken.objects.get(user=user)
    
    # Refresh the token
    token_url = 'https://www.strava.com/oauth/token'
    payload = {
        'client_id':os.environ.get("STRAVA_CLIENT_ID"),
        'client_secret': os.environ.get("STRAVA_CLIENT_SECRET"),
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

def fetchStats(after, before, page, access_token):
     # Returns an array
    response = requests.get(
        "https://www.strava.com/api/v3/athlete/activities",
        params={
            "before": before,
            "after": after,
            "page": page,
            "per_page": "30"
        },
        headers={
            "Authorization": f"Bearer {access_token}"
        }
    )
    # Check if the response is okay
    if response.status_code == 200:
        return response.json()
    else:
        # Raise an exception with the status code and error message
        response.raise_for_status()

def datetime_to_utc_timestamp(datetime_field):
    # Ensure the datetime is timezone-aware
    if datetime_field.tzinfo is None:
        datetime_field = timezone.make_aware(datetime_field, timezone=pytz.utc)
    
    # Convert to UTC if it's not already
    datetime_utc = datetime_field.astimezone(pytz.utc)
    
    # Get the Unix timestamp
    timestamp = int(datetime_utc.timestamp())
    return timestamp