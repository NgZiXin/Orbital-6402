from django.urls import path
from .views import strava_check_auth, strava_get_token, strava_get_stats, strava_clear_auth

urlpatterns = [
    path('check_auth/', strava_check_auth, name='strava_check_auth'),
    path('get_token/', strava_get_token, name='strava_get_token'),
    path('get_stats/', strava_get_stats, name='strava_get_stats'),
    path('clear_auth/', strava_clear_auth, name='strava_clear_auth'),
]