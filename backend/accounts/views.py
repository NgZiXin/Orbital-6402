from rest_framework import generics
from .serializers import CustomUserSerializer
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

class UserCreate(generics.CreateAPIView): 
    # Define class attributes
    permission_classes = [AllowAny]
    serializer_class = CustomUserSerializer

    # Override logic for create (i.e. method in generics.CreateAPIView Class)
    def create(self, request, *args, **kwargs):
        # Pass data into serialiser
        serializer = self.get_serializer(data=request.data)

        # Checks for invalid request
        serializer.is_valid(raise_exception=True)

        # Called by CreateModelMixin when saving a new object instance.
        self.perform_create(serializer)

        # Get Token
        user = serializer.instance
        token = Token.objects.get(user=user)

        # Custom output 
        return Response({'token': token.key})


class UserDetail(generics.RetrieveUpdateDestroyAPIView): # GET, PUT, DEL
    permission_classes = [IsAuthenticated]
    serializer_class = CustomUserSerializer
    
    # Get user's detail by through Authorization token instead of pk
    def get_object(self):
        return self.request.user




