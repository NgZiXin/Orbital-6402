from rest_framework import serializers

class FindNearestGymSerializer(serializers.Serializer):
    lat = serializers.FloatField(required=True)
    lon = serializers.FloatField(required=True)
    radius = serializers.IntegerField(required=True)
