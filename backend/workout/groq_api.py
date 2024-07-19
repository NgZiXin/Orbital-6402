from datetime import date
import groq, os

class GroqAPI:
    # Constants
    CLIENT = groq.Groq(api_key=os.environ["GROQ_API_KEY"]) # Fastest interference service
    MODEL_JSON="mixtral-8x7b-32768" # Model optimized for structured JSON output
    MODEL_CONVERSATION="llama3-70b-8192" # Model more suited for human-like response

    # Constructor
    def __init__(self, user):
        self.user = user
        self.weight = user.weight
        self.age = self.__calculate_age(user.birthday)
        self.gender = "Male" if user.gender == "M" else "Female"
    
    # Private Methods
    def __calculate_age(self, born):
        today = date.today()
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))

# Custom Exception
class BadResponseError(Exception):
    pass

class RateLimitError(Exception):
    pass