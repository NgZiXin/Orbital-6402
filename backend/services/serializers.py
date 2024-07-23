from rest_framework import serializers

class WebviewSerializer(serializers.Serializer):
    type = serializers.CharField()
    address = serializers.CharField()

    # Radius should be float (not int)
    radius = serializers.FloatField()



