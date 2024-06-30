from django.urls import path
from .views import find_nearest_gyms, find_nearest_parks, index

urlpatterns = [
    path('', index, name="index"),
    path('find_gyms/', find_nearest_gyms, name='find_nearest_gyms'),
    path('find_parks/', find_nearest_parks, name='find_nearest_parks'),
]