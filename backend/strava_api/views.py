import requests
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import StravaAccessToken, StravaRefreshToken
from .serializers import StravaGetTokenSerializer, StravaGetStatsSerializer
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from datetime import datetime, timedelta
from .utils import get_token, refresh_token, fetchStats, datetime_to_utc_timestamp
import pytz
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

@api_view(['GET'])
def strava_get_stats(request):
    serializer = StravaGetStatsSerializer(data=request.GET)
    if serializer.is_valid():
        # Create keys array (i.e. intervals)
        start_date = parse_datetime(request.GET.get('start_date'))
        end_date = parse_datetime(request.GET.get('end_date'))
        
        intervals = []
        current_date = start_date
        while current_date < end_date:
            next_date = current_date + timedelta(hours=24)
            intervals.append(next_date)
            current_date = next_date
        
        # Store weekly results
        all_results = []
        total_achievements = 0
        total_distance = 0
        total_duration = 0

        # Store daily results
        distance_daily = [0 for _ in range(len(intervals))] 
        duration_daily = [0 for _ in range(len(intervals))] 

        # Populate all_results
        access_token = get_token(request.user)
        prev_length = 30
        count = 1
        datetime_to_utc_timestamp(start_date)
        while(prev_length == 30):
            try:
                next_result = fetchStats(datetime_to_utc_timestamp(start_date), datetime_to_utc_timestamp(end_date), count, access_token)
                count += 1
                prev_length = len(next_result)
                all_results += next_result
            except:
                return Response({'error': 'fetch request failed'}, status=400)

        # Populate all variables
        for i in range(len(all_results)):
            activity = all_results[i]

            # get activity date
            start_date_utc = datetime.strptime(activity.get("start_date"), "%Y-%m-%dT%H:%M:%SZ")
            start_date_utc = start_date_utc.replace(tzinfo=pytz.UTC)
            start_date_singapore = start_date_utc.astimezone(pytz.timezone('Asia/Singapore'))

            # find its basket for daily results
            key = 0
            while(key < len(intervals)):
                if (start_date_singapore < intervals[key]):
                    break
                key += 1
            
            # update weekly results
            total_achievements += activity.get("achievement_count")
            total_distance += activity.get("distance") # In metres
            total_duration += activity.get("elapsed_time") # In seconds

            # update daily results
            distance_daily[key] += activity.get("distance")
            duration_daily[key] += activity.get("elapsed_time")
        
        # Output
        result = {
            "total_workout" : len(all_results),
            "total_achievements" : total_achievements,
            "total_distance" : total_distance,
            "total_duration" : total_duration,
            "distance_daily" : distance_daily,
            "duration_daily" : duration_daily,
        }

        return Response(result, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid Query'}, status=400)

            
                

        
        
     
   

