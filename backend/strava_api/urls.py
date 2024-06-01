from django.urls import path
from .views import strava_get_access, strava_get_token, strava_refresh_token

urlpatterns = [
    path('get_access/', strava_get_access, name='strava_get_access'),
    path('get_token/', strava_get_token, name='strava_get_token'),
    path('refresh_token/', strava_refresh_token, name='strava_refresh_token'),
]