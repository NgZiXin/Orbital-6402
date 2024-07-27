from .groq_api import GroqAPI, BadResponseError, RateLimitError
import groq, json, jsonschema


class WeightTrainer(GroqAPI):

    # Constructor
    def __init__(
            self, 
            user,
            fitness_level, 
            num_exercises, 
            main_muscle_groups, 
            sub_muscle_groups, 
            health_conditions, 
            other_remarks):
        super().__init__(user)
        self.fitness_level = fitness_level
        self.num_exercises = num_exercises
        self.main_muscle_groups = main_muscle_groups
        self.sub_muscle_groups = sub_muscle_groups
        self.health_conditions = health_conditions
        self.other_remarks = other_remarks
    

    # Public Methods
    def query_weight_training(self):
        numQueries = 0 # Allow up to a maximum of 3 requeries
        resp_json = {}

        while numQueries < 10:
            try:
                resp_json = self.__query_weight_training_json()
                break
            except(BadResponseError):
                print(numQueries)
                numQueries += 1
            
        # need to query general response
        if numQueries >= 10:
            resp_json = self.__query_weight_training_convo()
        return resp_json


    # Private Methods
    def __query_weight_training_json(self):
        # Throws Exception 
        try:
            # Define JSON Schema
            schema = {
                "type": "object",
                "properties": {
                    "exercises": {
                        "type": "array",
                        "minItems": self.num_exercises,
                        "maxItems": self.num_exercises,
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
            resp = GroqAPI.CLIENT.chat.completions.create(
                model = GroqAPI.MODEL_JSON,
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
                            Fitness Level: {self.fitness_level} / 10,
                            Health Condition: {self.health_conditions},
                            Other Remarks: {self.other_remarks},
                        }}

                        Based on my user profile, give me a strength training workout recommendation targetting the following main muscle groups: {self.main_muscle_groups},
                        and within the main muscle groups, target these sub muscle groups: {self.sub_muscle_groups}.
                        
                        The recommendation ouput should contain {self.num_exercises} number of exercises and must be in JSON format.
                        
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
                # Reference: https://deepinfra.com/mistralai/Mixtral-8x7B-Instruct-v0.1/api#input-top_p, 
                # https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
                temperature=2, # Increase randomness for more varied output
                max_tokens=5000, # Max its able to use 
                top_p=1, # More probable/less probable token 
                stream=False, # Dont break the output into individual streams
                response_format={"type": "json_object"}, # Obvious
                stop=None # Stop only when naturally complete response or run out of tokens (words/pieces of words)
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
    
    
    def __query_weight_training_convo(self):
        # Throws Exception 
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
                            Fitness Level: {self.fitness_level} / 10,
                            Health Condition: {self.health_conditions},
                            Other Remarks: {self.other_remarks},
                        }}

                        Based on my user profile, give me a strength training workout recommendation targetting the following main muscle groups: {self.main_muscle_groups},
                        and within the main muscle groups, target these sub muscle groups: {self.sub_muscle_groups}.
                        
                        The recommendation ouput should contain {self.num_exercises} number of exercises.
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