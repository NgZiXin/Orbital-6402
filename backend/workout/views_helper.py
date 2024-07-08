# Helper functions

from datetime import date
import jsonschema
import groq
import os
import json

# Global
client = groq.Groq(api_key=os.environ["GROQ_API_KEY"]) # Fastest interference service
model_json="mixtral-8x7b-32768" # Model optimized for structured JSON output
model_conversation="llama3-70b-8192" # Model more suited for human-like response

# Custom Exception
class BadResponseError(Exception):
    pass

class RateLimitError(Exception):
    pass

def query_weight_training(user, fitness_level, num_exercises, main_muscle_groups, sub_muscle_groups, health_conditions, other_remarks):
    # Throws Exception 
    try:
        # User data
        weight = user.weight
        age = calculate_age(user.birthday)
        gender = "Male" if user.gender == "M" else "Female"

        # Define JSON Schema
        schema = {
            "type": "object",
            "properties": {
                "exercises": {
                    "type": "array",
                    "minItems": num_exercises,
                    "maxItems": num_exercises,
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string"
                            },
                            "weight": {
                                "type": "number"
                            },
                            "sets": {
                                "type": "number"
                            },
                            "reps": {
                                "type": "number"
                            },
                            "rests": {
                                "type": "number"
                            }
                        },
                        "required": ["name", "weight", "sets", "reps", "rests"]
                    }
                },
            },
            "required": ["exercises"]
        }

        # Ensure JSON schema below matches that of above 
        resp = client.chat.completions.create(
            model=model_json,
            messages=[
                {
                    "role": "system",
                    "content": f"You are a gym trainer."
                },
                {
                    "role": "user",
                    "content": f"""
                    My profile: {{
                        Weight: {weight}kg, 
                        Age: {age} years-old,
                        Gender: {gender},
                        Fitness Level: {fitness_level} / 10,
                        Health Condition: {health_conditions},
                        Other Remarks: {other_remarks},
                    }}

                    Based on my user profile, give me a strength training workout recommendation targetting the following main muscle groups: {main_muscle_groups},
                    and within the main muscle groups, target these sub muscle groups: {sub_muscle_groups}.
                    
                    The recommendation ouput should contain {num_exercises} number of exercises and must be in JSON format.
                    
                    The JSON schema should include
                    {{
                        "exercises": [{{
                            "name": "string exercise name",
                            "weight" : "number weight in kg",
                            "sets" : "number of sets",
                            "reps" : "number of reps",
                            "rests" : "number rest intervals between sets in seconds",
                        }}],
                    }} 
                    """,
                }
            ],
            temperature=2, # Increase randomness for more varied output
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

        # Check JSON Object contains correct number of exercises

        return resp_json

    except(jsonschema.exceptions.ValidationError, groq.BadRequestError):
        raise(BadResponseError)
    
    except(groq.RateLimitError):
        raise(RateLimitError)


def query_run_training(
        user, 
        target_distance, 
        target_duration, 
        training_weeks, 
        health_conditions, 
        other_remarks, 
        total_distance="UNKNOWN", 
        average_pace="UNKNOWN", 
        furthest_run="UNKNOWN"
    ):
    # Throws Exception 
    try:
        # User data
        weight = user.weight
        age = calculate_age(user.birthday)
        gender = "Male" if user.gender == "M" else "Female"

        # Define JSON Schema
        schema = {
            "type": "object",
            "properties": {
                "exercises": {
                "type": "array",
                "minItems": training_weeks,
                "maxItems": training_weeks,
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
        resp = client.chat.completions.create(
            model=model_json,
            messages=[
                {
                    "role": "system",
                    "content": "You are a running trainer."
                },
                {
                    "role": "user",
                    "content": f"""
                    My profile: {{
                        Weight: {weight}kg, 
                        Age: {age} years-old,
                        Gender: {gender},
                        Health Condition: {health_conditions},
                        Other Remarks: {other_remarks},
                    }}

                    My Strava Record (in the past 4 weeks, if any): {{
                        Total Distance Ran: {total_distance}km
                        Average Pace: {average_pace} minutes / seconds per km
                        Furthest Run: {furthest_run}
                    }}
                    
                    My next goal: {{
                        Target Distance: {target_distance}
                        Target Finishing Time: {target_duration}
                    }}

                    Based on my user profile and my current level of fitness, recommend me a running training plan to prepare me for my goal.

                    The recommended training plan must be {training_weeks} weeks long and must be in JSON format.

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

def query_weight_training_general(user, fitness_level, num_exercises, main_muscle_groups, sub_muscle_groups, health_conditions, other_remarks):
    # Throws Exception 
    try:
        # User data
        weight = user.weight
        age = calculate_age(user.birthday)
        gender = "Male" if user.gender == "M" else "Female"

        # Query without enforcing JSON response
        resp = client.chat.completions.create(
            model=model_conversation,
            messages=[
                {
                    "role": "system",
                    "content": f"You are a gym trainer."
                },
                {
                    "role": "user",
                    "content": f"""
                    My profile: {{
                        Weight: {weight}kg, 
                        Age: {age} years-old,
                        Gender: {gender},
                        Fitness Level: {fitness_level} / 10,
                        Health Condition: {health_conditions},
                        Other Remarks: {other_remarks},
                    }}

                    Based on my user profile, give me a strength training workout recommendation targetting the following main muscle groups: {main_muscle_groups},
                    and within the main muscle groups, target these sub muscle groups: {sub_muscle_groups}.
                    
                    The recommendation ouput should contain {num_exercises} number of exercises.
                    """,
                }
            ],
            temperature=0.5, # Reduce Randomness
            max_tokens=5000,
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

def query_run_training_general(
        user, 
        target_distance, 
        target_duration, 
        training_weeks, 
        health_conditions, 
        other_remarks, 
        total_distance="UNKNOWN", 
        average_pace="UNKNOWN", 
        furthest_run="UNKNOWN"
    ):
    # Throws Exception 
    try:
        # User data
        weight = user.weight
        age = calculate_age(user.birthday)
        gender = "Male" if user.gender == "M" else "Female"

        # Query without enforcing JSON response
        resp = client.chat.completions.create(
            model=model_conversation,
            messages=[
                {
                    "role": "system",
                    "content": f"You are a gym trainer."
                },
                {
                    "role": "user",
                    "content": f"""
                    My profile: {{
                        Weight: {weight}kg, 
                        Age: {age} years-old,
                        Gender: {gender},
                        Health Condition: {health_conditions},
                        Other Remarks: {other_remarks},
                    }}

                    My Strava Record (in the past 4 weeks, if any): {{
                        Total Distance Ran: {total_distance}km
                        Average Pace: {average_pace} minutes / seconds per km
                        Furthest Run: {furthest_run}
                    }}
                    
                    My next goal: {{
                        Target Distance: {target_distance}
                        Target Finishing Time: {target_duration}
                    }}

                    Based on my user profile and my current level of fitness, recommend me a running training plan to prepare me for my goal.

                    The recommended training plan must be {training_weeks} weeks long.
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

# Utils
def calculate_age(born):
    today = date.today()
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))