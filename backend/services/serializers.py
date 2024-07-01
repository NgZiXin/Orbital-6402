from rest_framework import serializers

class WebviewSerializer(serializers.Serializer):
    type = serializers.CharField(required=True)
    lat = serializers.FloatField(required=True)
    lon = serializers.FloatField(required=True)
    radius = serializers.IntegerField(default=3000)

class FindNearestSerializer(serializers.Serializer):
    lat = serializers.FloatField(required=True)
    lon = serializers.FloatField(required=True)
    radius = serializers.IntegerField(default=3000)


