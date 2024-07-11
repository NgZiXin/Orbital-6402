from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import Calendar
from .serializers import CalendarSerializer

class CalendarList(generics.ListCreateAPIView):
    serializer_class = CalendarSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Calendar.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CalendarDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CalendarSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        # Filter calendar entriess by user ensures user can only update or destroy their own entries
        user = self.request.user
        return Calendar.objects.filter(user=user)

