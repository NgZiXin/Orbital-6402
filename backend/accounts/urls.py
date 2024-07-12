from django.urls import path
from .views import UserCreate, UserDetail, PingView
from rest_framework.authtoken import views

urlpatterns = [
    path('', UserCreate.as_view(), name="user-create"), # GET
    path('detail/', UserDetail.as_view(), name="user-detail"), # GET
    path('ping/', PingView.as_view(), name='ping'), # GET
    path('login/', views.obtain_auth_token, name='login'), # POST
]