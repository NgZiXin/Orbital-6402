from django.contrib import admin
from .models import StravaAccessToken, StravaRefreshToken

# Register your models here.
admin.site.register(StravaAccessToken)
admin.site.register(StravaRefreshToken)