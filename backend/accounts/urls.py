from django.urls import path
from .views import UserListCreate, UserDetail, UserData
from rest_framework.authtoken import views

urlpatterns = [
    path('', UserListCreate.as_view(), name="user-list-create"), # GET
    path('<int:pk>/', UserDetail.as_view(), name="user-detail"), # GET
    path('data/', UserData.as_view(), name="user-data"), # GET
    path('login/', views.obtain_auth_token, name='login'), # POST
]