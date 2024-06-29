from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("get_path", views.get_path, name="get-path"),
]