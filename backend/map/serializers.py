from rest_framework import serializers

class GetPathSerializer(serializers.Serializer):
    start = serializers.CharField(required=True)
    end = serializers.CharField(required=True)
