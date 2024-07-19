from .groq_api import  RateLimitError
from .weight_trainer import WeightTrainer
from .run_trainer import RunTrainer
from .serializers import GetWeightTrainingSerializer, GetRunTrainingSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.

@api_view(['GET'])
def get_weight_training(request):
    serializer = GetWeightTrainingSerializer(data=request.GET)
    if serializer.is_valid():
        try:
            weight_trainer = WeightTrainer(
                request.user,
                int(request.GET.get("fitnessLevel")),
                int(request.GET.get("numExercises")),
                request.GET.get("mainMuscleGroups"),
                request.GET.get("subMuscleGroups"),
                request.GET.get("healthConds"),
                request.GET.get("otherRemarks"),
                )
            
            resp_json = weight_trainer.query_weight_training()
        except(RateLimitError):
            return Response({'error': 'AI is currently overloaded with queries, try again after 5 minutes'}, status=400)
        return Response(resp_json)
    return Response({'error': 'Invalid Query'}, status=400)

@api_view(['GET'])
def get_run_training(request):
    serializer = GetRunTrainingSerializer(data=request.GET)
    if serializer.is_valid():
        try:
            run_trainer = RunTrainer(
                request.user,
                int(request.GET.get("distance")),
                request.GET.get("duration"),
                int(request.GET.get("weeks")),
                request.GET.get("healthConds"),
                request.GET.get("otherRemarks"),
                )
            
            resp_json = run_trainer.query_run_training()
        except(RateLimitError):
            return Response({'error': 'AI is currently overloaded with queries, try again after 5 minutes'}, status=400)
        return Response(resp_json)
    return Response({'error': 'Invalid Query'}, status=400)