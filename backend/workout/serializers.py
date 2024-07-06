from rest_framework import serializers

class GetWeightTrainingSerializer(serializers.Serializer):
    fitnessLevel = serializers.IntegerField(required=True),
    numExercises = serializers.IntegerField(required=True),
    mainMuscleGroups = serializers.CharField(required=True),
    subMuscleGroups = serializers.CharField(required=True),
    healthConds = serializers.CharField(required=True),
    otherRemarks = serializers.CharField(required=True),
    