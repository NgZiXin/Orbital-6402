from django.urls import path
from .views import CalendarList, CalendarDetail

urlpatterns = [
    path('', CalendarList.as_view(), name="calendar-list"),
    path('<int:pk>/', CalendarDetail.as_view(), name="calendar-detail")
]