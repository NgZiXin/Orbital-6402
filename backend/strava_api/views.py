import requests
from rest_framework.response import Response
from .exceptions import UserDeauthorized
from .models import StravaToken
from .serializers import StravaGetTokenSerializer, StravaGetStatsSerializer
from rest_framework.decorators import api_view
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime, timedelta
import pytz, os
from datetime import datetime


# Helper function 
def convert_to_singapore_time(date_str):
    # UTC+0 time 
    date_naive = parse_datetime(date_str)
    
    # UTC+8 time
    singapore_tz = pytz.timezone("Asia/Singapore")
    date_singapore = date_naive.astimezone(singapore_tz)
    return(date_singapore)

@api_view(['GET'])
def strava_check_auth(request):
    user = request.user
    response = {"CLIENT_ID": os.environ.get("STRAVA_CLIENT_ID")}
    
    try:
        token = StravaToken.objects.get(user=user)
        if token.get_authorize():
            response["status"] = "AUTHORIZED"
        else:
            response["status"] = "DEAUTHORIZED"
    except ObjectDoesNotExist:
        response["status"] = "UNAUTHORIZED"
    
    return Response(response)

@api_view(['GET'])
def strava_clear_auth(request):
    # Make space for next user
    if(StravaToken.objects.filter(authorize=True).count() >= int(os.environ.get("MAX_USERS"))):
        token = StravaToken.objects.filter(authorize=True).earliest('updated_at')
        token.deauthorize_token()
    
    return Response({"message": "There is now space for your sync."})
    

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
        StravaToken.create_or_update_token(request.user,
                                token_json.get('access_token'),
                                token_json.get('refresh_token'),
                                timezone.now() + timedelta(seconds=token_json.get('expires_in')),
                                token_json.get('scope'),
                                True).save()
        return Response({'message': 'Access token successfully created and saved.'})
    return Response({'error': 'Invalid Query'}, status=400)

@api_view(['GET'])
def strava_get_stats(request):
    serializer = StravaGetStatsSerializer(data=request.GET)
    if serializer.is_valid():
        try:
            # Create an array of end dates 
            # Populate it with 7 end dates (mon end, tues end ... sun end)
            week_start_date = convert_to_singapore_time(request.GET.get('start_date'))
            week_end_date = convert_to_singapore_time(request.GET.get('end_date'))

            end_dates = [0 for _ in range(7)]

            # Week start date is 1 minute past midnight 
            # Subtract 1 minute & 1 second from it to get the correct base value 
            current_end = week_start_date - timedelta(minutes= 1, seconds= 1)
            for i in range(7):
                next_end = current_end + timedelta(hours= 24)
                end_dates[i] = next_end
                current_end = next_end

            # Store weekly activities
            all_activities = []
            total_achievements = 0
            total_distance = 0
            total_duration = 0

            # Store daily activities
            distance_daily = [0 for _ in range(7)] 
            duration_daily = [0 for _ in range(7)] 

            # Populate all_activities
            token = StravaToken.objects.get(user=request.user)
            max_activities_per_page = 30
            page_number = 1

            week_start_date_epoch = int(week_start_date.timestamp())
            week_end_date_epoch = int(week_end_date.timestamp())

            while True:
                next_activities = token.fetch_activities(week_start_date_epoch, week_end_date_epoch, page_number)
                all_activities += next_activities

                if len(next_activities) < max_activities_per_page: 
                    # We are at the last page already 
                    # Exit out since we have collected all relevant activites
                    break 
                else:
                    # Continue onto the next page 
                    page_number += 1

            # Populate all other variables
            for i in range(len(all_activities)):
                activity = all_activities[i]
               
                # Start date with no timezone info 
                start_date_naive = datetime.strptime(activity.get("start_date"), "%Y-%m-%dT%H:%M:%SZ")

                # Give the start date a timezone of UTC+0 
                # Which is actually its implicit timezone 
                utc_tz = pytz.UTC
                start_date_utc0 = utc_tz.localize(start_date_naive)
                
                # Convert the timezone to UTC+8 (SG time)
                singapore_tz = pytz.timezone('Asia/Singapore')
                start_date_utc8 = start_date_utc0.astimezone(singapore_tz)

                # Find its basket for daily activities
                key = 0
                while(key < 7):
                    if (start_date_utc8 < end_dates[key]):
                        break
                    key += 1
                
                # Update weekly activities
                total_achievements += activity.get("achievement_count")
                total_distance += activity.get("distance") # In metres
                total_duration += activity.get("elapsed_time") # In seconds

                # Update daily activities
                distance_daily[key] += activity.get("distance")
                duration_daily[key] += activity.get("elapsed_time")
            
            # Output
            result = {
                "total_workout" : len(all_activities),
                "total_achievements" : total_achievements,
                "total_distance" : total_distance,
                "total_duration" : total_duration,
                "distance_daily" : distance_daily,
                "duration_daily" : duration_daily,
            }
            return Response(result)
        except ObjectDoesNotExist:
            return Response({'error': 'UNAUTHORIZED'}, status=400)
        except UserDeauthorized:
            return Response({'error': 'DEAUTHORIZED'}, status=400)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    return Response({'error': 'Invalid Query'}, status=400)

