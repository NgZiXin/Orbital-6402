from rest_framework import serializers
from .models import CustomUser
from strava_api.serializers import StravaAccessTokenSerializer, StravaRefreshTokenSerializer
from django.contrib.auth.hashers import make_password

class CustomUserSerializer(serializers.ModelSerializer):
    # Display additional info
    strava_access_token = StravaAccessTokenSerializer(read_only=True)
    strava_refresh_token = StravaRefreshTokenSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password', 'height', 'weight', 'birthday', 'gender', 'strava_access_token', 'strava_refresh_token']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = self.Meta.model(**validated_data)
        if password:
            user.set_password(password) # Hash password
        user.save() # Save the user instance to the database
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance