from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Calendar
from .serializers import CalendarSerializer

@api_view(['GET', 'POST'])
def calendar_list(request):
    user = request.user
    
    if request.method == 'GET':
        calendars = Calendar.objects.filter(user=user)
        serializer = CalendarSerializer(calendars, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        data = request.data.copy()
        data['user'] = user.id  # Associate the calendar entry with the authenticated user
        serializer = CalendarSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE'])
def calendar_detail(request, pk):
    user = request.user
    try:
        calendar = Calendar.objects.get(pk=pk, user=user)
    except Calendar.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CalendarSerializer(calendar)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        calendar.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)