from rest_framework import serializers

class WebviewSerializer(serializers.Serializer):
    type = serializers.CharField()
    address = serializers.CharField()
    radius = serializers.IntegerField()



