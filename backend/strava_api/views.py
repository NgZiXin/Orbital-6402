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
from backend.utils import datetime_to_utc_timestamp
import pytz, os

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
            # Create keys array (i.e. intervals)
            start_date = parse_datetime(request.GET.get('start_date'))
            end_date = parse_datetime(request.GET.get('end_date'))
            
            intervals = [0 for _ in range(7)]
            current_date = start_date
            for i in range(7):
                next_date = current_date + timedelta(hours=24)
                intervals[i] = next_date
                current_date = next_date
            
            # Store weekly results
            all_results = []
            total_achievements = 0
            total_distance = 0
            total_duration = 0

            # Store daily results
            distance_daily = [0 for _ in range(7)] 
            duration_daily = [0 for _ in range(7)] 

            # Populate all_results
            token = StravaToken.objects.get(user=request.user)
            prev_length = 30
            count = 1
            datetime_to_utc_timestamp(start_date)
            while(prev_length == 30):
                next_result = token.fetch_activities(datetime_to_utc_timestamp(start_date), datetime_to_utc_timestamp(end_date), count)
                count += 1
                prev_length = len(next_result)
                all_results += next_result

            # Populate all variables
            for i in range(len(all_results)):
                activity = all_results[i]

                # get activity date
                start_date_utc = datetime.strptime(activity.get("start_date"), "%Y-%m-%dT%H:%M:%SZ")
                start_date_utc = start_date_utc.replace(tzinfo=pytz.UTC)
                start_date_singapore = start_date_utc.astimezone(pytz.timezone('Asia/Singapore'))

                # find its basket for daily results
                key = 0
                while(key < 7):
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
            return Response(result)
        except ObjectDoesNotExist:
            return Response({'error': 'UNAUTHORIZED'}, status=400)
        except UserDeauthorized:
            return Response({'error': 'DEAUTHORIZED'}, status=400)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    return Response({'error': 'Invalid Query'}, status=400)

            
                

        
        
     
   

