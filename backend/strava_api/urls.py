from django.urls import path
from .views import strava_check_auth, strava_get_token

urlpatterns = [
    path('check_auth/', strava_check_auth, name='strava_check_auth'),
    path('get_token/', strava_get_token, name='strava_get_token'),
]