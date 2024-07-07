from django.urls import path
from . import views

urlpatterns = [
    path('', views.calendar_list, name="calendar-list"),
    path('<int>pk/', views.calendar_detail, name="calendar-detail")
]