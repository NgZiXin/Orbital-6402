from rest_framework import serializers
from .models import StravaToken
import os

class StravaGetTokenSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)
    scope = serializers.CharField(required=True)

class StravaGetStatsSerializer(serializers.Serializer):
    start_date = serializers.DateTimeField(required=True) 
    end_date = serializers.DateTimeField(required=True) 
