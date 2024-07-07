from .views_helper import query_weight_training, query_run_training, query_weight_training_general, query_run_training_general, RateLimitError, BadResponseError
from .serializers import GetWeightTrainingSerializer
from strava_api.views_helpers import get_token, fetchStats
from backend.utils import datetime_to_utc_timestamp
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.utils import timezone
from datetime import timedelta

# Create your views here.

@api_view(['GET'])
def get_weight_training(request):
    serializer = GetWeightTrainingSerializer(data=request.GET)
    if serializer.is_valid():
        user = request.user
        resp_json = None
        numQueries = 0 # Allow up to a maximum of 3 requeries

        while numQueries < 3:
            try:
                resp_json = query_weight_training(
                    user, 
                    int(request.GET.get('fitnessLevel')),
                    int(request.GET.get('numExercises')),
                    request.GET.get('mainMuscleGroups'),
                    request.GET.get('subMuscleGroups'),
                    request.GET.get('healthConds'),
                    request.GET.get('otherRemarks')
                )
                break
            except(BadResponseError):
                numQueries += 1
            except(RateLimitError):
                # Error, need to wait for rate limits to refresh
                return Response({'error': 'AI is currently overloaded with queries, try again after 5 minutes'}, status=400)

        # need to query general response
        if not resp_json:
            try:
                resp_json = query_weight_training_general(
                        user, 
                        int(request.GET.get('fitnessLevel')),
                        int(request.GET.get('numExercises')),
                        request.GET.get('mainMuscleGroups'),
                        request.GET.get('subMuscleGroups'),
                        request.GET.get('healthConds'),
                        request.GET.get('otherRemarks')
                    )
            except(RateLimitError):
                # Error, need to wait for rate limits to refresh
                return Response({'error': 'AI is currently overloaded with queries, try again after 5 minutes'}, status=400)


        return Response(resp_json, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid Query'}, status=400)

@api_view(['GET'])
def get_run_training(request):
    user = request.user
    resp_json = None
    numQueries = 0 # Allow up to a maximum of 3 requeries

    # Get token and fields
    access_token = get_token(user)
    all_results = []
    count = 1
    if access_token:
        end_date = timezone.now()
        start_date = end_date - timedelta(days=28) # 4 Weeks
        prev_length = 30
        datetime_to_utc_timestamp(start_date)
        while(prev_length == 30):
            try:
                next_result = fetchStats(datetime_to_utc_timestamp(start_date), datetime_to_utc_timestamp(end_date), count, access_token)
                prev_length = len(next_result)
                count += 1
                all_results += next_result
            except:
                return Response({'error': 'fetch request failed'}, status=400)

    strava_total_distance = 0
    strava_total_duration = 0
    strava_furthest_run = 0
    strava_average_pace = "0:00"
    for i in range(len(all_results)):
            activity = all_results[i]
            if activity.get("sport_type") == "Run":
                strava_total_distance += activity.get("distance") # In metres
                strava_total_duration += activity.get("elapsed_time") # In seconds
                strava_furthest_run = max(strava_furthest_run, activity.get("distance")) # In metres
    
    # Convert data to other units and 2 signficant places
    strava_total_distance = round(strava_total_distance / 1000, 2) # metres to kilometres
    strava_furthest_run = round(strava_furthest_run / 1000, 2) # metres to kilometres
    if strava_total_distance > 0:
        average_pace_minutes, average_pace_sec = divmod(strava_total_duration / strava_total_distance, 60)
        strava_average_pace = f"{int(average_pace_minutes)}:{int(average_pace_sec):02d}"  # minutes:seconds per km

    while numQueries < 3:
        try:
            if access_token:
                # Give AI Strava details
                resp_json = query_run_training(
                    user, 
                    request.GET.get("distance"),
                    request.GET.get("duration"),
                    int(request.GET.get("weeks")),
                    request.GET.get("healthConds"),
                    request.GET.get("otherRemarks"),
                    strava_total_distance, 
                    strava_average_pace, 
                    strava_furthest_run
                )
            else:
                # Give AI only the user details
                resp_json = query_run_training(
                    user,
                    request.GET.get("distance"),
                    request.GET.get("duration"),
                    int(request.GET.get("weeks")),
                    request.GET.get("healthConds"),
                    request.GET.get("otherRemarks")
                )

            break
        except(BadResponseError):
            numQueries += 1
        except(RateLimitError):
            # Error, need to wait for rate limits to refresh
            return Response({'error': 'AI is currently overloaded with queries, try again after 5 minutes'}, status=400)

        if not resp_json:
            try:
                if access_token:
                    # Give AI Strava details
                    resp_json = query_run_training_general(
                        user, 
                        request.GET.get("distance"),
                        request.GET.get("duration"),
                        int(request.GET.get("weeks")),
                        request.GET.get("healthConds"),
                        request.GET.get("otherRemarks"),
                        strava_total_distance, 
                        strava_average_pace, 
                        strava_furthest_run
                    )
                else:
                    # Give AI only the user details
                    resp_json = query_run_training_general(
                        user,
                        request.GET.get("distance"),
                        request.GET.get("duration"),
                        int(request.GET.get("weeks")),
                        request.GET.get("healthConds"),
                        request.GET.get("otherRemarks")
                    )
            except(RateLimitError):
                # Error, need to wait for rate limits to refresh
                return Response({'error': 'AI is currently overloaded with queries, try again after 5 minutes'}, status=400)

    return Response(resp_json, status=status.HTTP_200_OK)
