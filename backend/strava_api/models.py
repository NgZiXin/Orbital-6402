from django.db import models
from accounts.models import CustomUser
from django.utils import timezone
from datetime import timedelta
from .exceptions import UserDeauthorized
import os, requests

class StravaToken(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    authorize = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    access_token = models.CharField(null=True)
    refresh_token = models.CharField(null=True)
    expires_at = models.DateTimeField(null=True)

    read = models.BooleanField(default=False)
    read_all = models.BooleanField(default=False)
    profile_read_all = models.BooleanField(default=False)
    activity_read_all = models.BooleanField(default=False)

    # Factory Method
    @classmethod
    def create_or_update_token(cls, user, access_token, refresh_token, expires_at, scope_str, authorize):
        """
        Factory method to create a new StravaToken instance.
        """
         # Check if a token already exists for the user
        instance, created = cls.objects.get_or_create(user=user)

        # Update fields of the existing instance or newly created instance
        instance.access_token = access_token
        instance.refresh_token = refresh_token
        instance.expires_at = expires_at
        instance.authorize = authorize
        instance.__set_scope(scope_str) 
        
        return instance
    
    # Public Methods
    def get_token(self): # Tell don't ask principle
        """
        User must be authorized before they can get their access token
        """
        if not self.authorize:
            raise UserDeauthorized
        
        self.__refresh_token()
        return self.access_token
    
    def get_authorize(self):
        return self.authorize

    def deauthorize_token(self):
        if not self.authorize:
            return
        
        # Refresh Token
        self.__refresh_token()

        # Deauthorize
        requests.post(
            'https://www.strava.com/oauth/deauthorize',
            data={
                'access_token': self.access_token,
            }
        )
        self.authorize = False # Set authorization attribute to false
        self.save()

    
    def fetch_activities(self, after, before, page):
        """
        Fetch user's activities from Strava
        """
        if not self.authorize:
            raise UserDeauthorized
        
        # Refresh Token
        self.__refresh_token()
        
        response = requests.get(
            "https://www.strava.com/api/v3/athlete/activities",
            params={
                "before": before,
                "after": after,
                "page": page,
                "per_page": "30"
            },
            headers={
                "Authorization": f"Bearer {self.access_token}"
            }
        )
        # Check if the response is okay
        if response.status_code == 200:
            return response.json()
        else:
            # Raise an exception with the status code and error message
            response.raise_for_status()

    # Private Methods
    def __refresh_token(self):
        """
        User must be authorized before they can refresh token
        """
        if not self.authorize:
            raise UserDeauthorized
        
        if self.expires_at >= timezone.now():
            return
        
        # Refresh the token
        token_url = 'https://www.strava.com/oauth/token'
        payload = {
            'client_id':os.environ.get("STRAVA_CLIENT_ID"),
            'client_secret': os.environ.get("STRAVA_CLIENT_SECRET"),
            'grant_type': 'refresh_token',
            'refresh_token': self.refresh_token,
        }
        token_response = requests.post(token_url, data=payload)
        
        # Obtain data & save data
        token_json = token_response.json()
        self.access_token = token_json.get('access_token')
        self.expires_at = timezone.now() + timedelta(seconds=token_json.get('expires_in'))
        self.refresh_token = token_json.get('refresh_token')
        self.save()
    
    def __set_scope(self, scope_str):
        if scope_str:
            scopes = scope_str.split(',')
            self.read_all = 'read_all' in scopes
            self.profile_read_all = 'profile:read_all' in scopes
            self.activity_read_all = 'activity:read_all' in scopes
    