from django.utils import timezone
from datetime import datetime
import pytz

def datetime_to_utc_timestamp(datetime_field):
    # Ensure the datetime is timezone-aware
    if datetime_field.tzinfo is None:
        datetime_field = timezone.make_aware(datetime_field, timezone=pytz.utc)
    
    # Convert to UTC if it's not already
    datetime_utc = datetime_field.astimezone(pytz.utc)
    
    # Get the Unix timestamp
    timestamp = int(datetime_utc.timestamp())
    return timestamp

def convert_unix_to_singapore_time(unix_timestamp):
    # Convert Unix timestamp to a datetime object
    singapore_tz = pytz.timezone('Asia/Singapore')
    singapore_time = datetime.fromtimestamp(unix_timestamp, tz=singapore_tz)
    return singapore_time
