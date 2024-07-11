from .groq_api import GroqAPI, BadResponseError, RateLimitError
from strava_api.models import StravaToken
from backend.utils import datetime_to_utc_timestamp
from django.utils import timezone
from datetime import timedelta
import jsonschema, groq, json

class RunTrainer(GroqAPI):

        # Constructor
        def __init__(
                self, 
                user,
                target_distance, 
                target_duration, 
                training_weeks, 
                health_conditions, 
                other_remarks):
                
            super().__init__(user)
            self.target_distance = target_distance
            self.target_duration = target_duration
            self.training_weeks = training_weeks
            self.health_conditions = health_conditions
            self.other_remarks = other_remarks

            # Strava Details
            self.strava_total_distance = "Unknown"
            self.strava_furthest_run = "Unknown"
            self.strava_average_pace = "Unknown"

            try:
                strava_total_distance,  strava_furthest_run, strava_average_pace = self.__get_strava_stats()
                self.strava_total_distance = strava_total_distance
                self.strava_furthest_run = strava_furthest_run
                self.strava_average_pace = strava_average_pace
            except:
                pass


        # Public Methods
        def query_run_training(self):
            numQueries = 0 # Allow up to a maximum of 3 requeries
            resp_json = {}

            while numQueries < 3:
                try:
                    resp_json = self.__query_run_training_json()
                    break
                except(BadResponseError):
                    numQueries += 1
                
            # need to query general response
            if numQueries >= 3:
                resp_json = self.__query_run_training_convo()
            return resp_json

        
        # Private Methods
        def __get_strava_stats(self):
            # Get token and fields
            token = StravaToken.objects.get(user=self.user)

            # Populate all_results
            all_results = []
            count = 1
            end_date = timezone.now()
            start_date = end_date - timedelta(days=28) # 4 Weeks
            prev_length = 30
            datetime_to_utc_timestamp(start_date)
            while(prev_length == 30):
                next_result = token.fetch_activities(datetime_to_utc_timestamp(start_date), datetime_to_utc_timestamp(end_date), count)
                prev_length = len(next_result)
                count += 1
                all_results += next_result

            # Get distance, furthest dist, average pace
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

            return strava_total_distance,  strava_furthest_run, strava_average_pace


        def __query_run_training_json(self):
            try:
                # Define JSON Schema
                schema = {
                    "type": "object",
                    "properties": {
                        "exercises": {
                        "type": "array",
                        "minItems": self.training_weeks,
                        "maxItems": self.training_weeks,
                        "items": {
                            "type": "object",
                            "properties": {
                            "week": {
                                "type": "number",
                            },
                            "detail": {
                                "type": "array",
                                "items": {
                                "type": "object",
                                "properties": {
                                    "day": {
                                    "type": "string",
                                    "enum": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
                                    },
                                    "desc": {
                                    "type": "string",
                                    },
                                    "dist": {
                                    "type": "number",
                                    },
                                    "zone": {
                                    "type": "number",
                                    }
                                },
                                "required": ["day", "desc", "dist", "zone"]
                                }
                            }
                            },
                            "required": ["week", "detail"]
                        }
                        }
                    },
                    "required": ["exercises"]
                }

                # Ensure JSON schema below matches that of above 
                resp = GroqAPI.CLIENT.chat.completions.create(
                    model=GroqAPI.MODEL_JSON,
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a running trainer."
                        },
                        {
                            "role": "user",
                            "content": f"""
                            My profile: {{
                                Weight: {self.weight}kg, 
                                Age: {self.age} years-old,
                                Gender: {self.gender},
                                Health Condition: {self.health_conditions},
                                Other Remarks: {self.other_remarks},
                            }}

                            My Strava Record (in the past 4 weeks, if any): {{
                                Total Distance Ran: {self.strava_total_distance}km
                                Average Pace: {self.strava_average_pace} minutes / seconds per km
                                Furthest Run: {self.strava_furthest_run}
                            }}
                            
                            My next goal: {{
                                Target Distance: {self.target_distance}
                                Target Finishing Time: {self.target_duration}
                            }}

                            Based on my user profile and my current level of fitness, recommend me a running training plan to prepare me for my goal.

                            The recommended training plan must be {self.training_weeks} weeks long and must be in JSON format.

                            The JSON schema should include
                            {{
                                "exercises": [{{
                                    "week" : "number training week"
                                    "detail" : [{{
                                        "day" : "string (mon, tue, wed, thu, fri, sat, sun) only
                                        "desc": "string short and concise exercise description",
                                        "dist": "number estimated distance",
                                        "zone":"number heart rate zone to maintain"
                                    }}]
                                }}]
                            }}
                            """,
                        }
                    ],
                    temperature=0.5, # Decrease randomness for my consistent data refecting next week's recommendation
                    max_tokens=5000,
                    top_p=1,
                    stream=False,
                    response_format={"type": "json_object"},
                    stop=None
                )
                
                # Convert to JSON object
                resp_json = json.loads(resp.choices[0].message.content)

                # Check JSON Object has required fields
                jsonschema.validate(resp_json, schema=schema)

                return resp_json
            except(jsonschema.exceptions.ValidationError, groq.BadRequestError):
                raise(BadResponseError)
            except(groq.RateLimitError):
                raise(RateLimitError)


        def __query_run_training_convo(self):
            try:
                # Query without enforcing JSON response
                resp = GroqAPI.CLIENT.chat.completions.create(
                    model=GroqAPI.MODEL_CONVERSATION,
                    messages=[
                        {
                            "role": "system",
                            "content": f"You are a gym trainer."
                        },
                        {
                            "role": "user",
                            "content": f"""
                            My profile: {{
                                Weight: {self.weight}kg, 
                                Age: {self.age} years-old,
                                Gender: {self.gender},
                                Health Condition: {self.health_conditions},
                                Other Remarks: {self.other_remarks},
                            }}

                            My Strava Record (in the past 4 weeks, if any): {{
                                Total Distance Ran: {self.strava_total_distance}km
                                Average Pace: {self.strava_average_pace} minutes / seconds per km
                                Furthest Run: {self.strava_furthest_run}
                            }}
                            
                            My next goal: {{
                                Target Distance: {self.target_distance}
                                Target Finishing Time: {self.target_duration}
                            }}

                            Based on my user profile and my current level of fitness, recommend me a running training plan to prepare me for my goal.

                            The recommended training plan must be {self.training_weeks} weeks long.
                            """,
                        }
                    ],
                    temperature=0.5, # Reduce Randomness
                    max_tokens=5000, # Allocate more resources
                    top_p=1,
                    stream=False,
                    stop=None
                )

                # Create dict for response
                resp_json = {
                    "message" : resp.choices[0].message.content
                }
                return resp_json
            except(groq.RateLimitError):
                raise(RateLimitError)  
