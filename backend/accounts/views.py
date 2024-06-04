from rest_framework import generics
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
class UserListCreate(generics.ListCreateAPIView): # listing and creating users
    permission_classes = [AllowAny]
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    # Temp
    def create(self, request, *args, **kwargs):
        print(request.data)  # This will log the request body
        return super().create(request, *args, **kwargs)

class UserDetail(generics.RetrieveAPIView): 
    permission_classes = [AllowAny]
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class UserData(generics.RetrieveUpdateDestroyAPIView): # retrieving, updating, and deleting users
    permission_classes = [IsAuthenticated]
    serializer_class = CustomUserSerializer
    def get_object(self):
        return self.request.user




