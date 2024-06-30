from rest_framework import serializers
from .models import StravaAccessToken, StravaRefreshToken

class StravaGetTokenSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)
    scope = serializers.CharField(required=True)

class StravaAccessTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = StravaAccessToken
        fields = ['id', 'access_token', 'expires_at', 'read', 'read_all', 'profile_read_all', 'profile_write', 'activity_read_all', 'activity_write']
