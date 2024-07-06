from django.urls import path
from .views import get_weight_training, get_running_training

urlpatterns = [
    path('get_weight_training/', get_weight_training, name='get_weight_training'),
    path('get_running_training/', get_running_training, name='get_running_training'),
]