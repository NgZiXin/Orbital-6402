from django.urls import path
from .views import get_weight_training, get_run_training

urlpatterns = [
    path('get_weight_training/', get_weight_training, name='get_weight_training'),
    path('get_run_training/', get_run_training, name='get_run_training'),
]