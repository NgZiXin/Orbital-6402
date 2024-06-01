from django.urls import path
from .views import find_nearest_gym

urlpatterns = [
    path('find_gym/', find_nearest_gym, name='find_nearest_gym'),
]