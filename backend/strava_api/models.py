from django.db import models
from accounts.models import CustomUser

class StravaAccessToken(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    access_token = models.CharField(null=True)
    expires_at = models.DateTimeField(null=True)
    read = models.BooleanField(default=False)
    read_all = models.BooleanField(default=False)
    profile_read_all = models.BooleanField(default=False)
    profile_write = models.BooleanField(default=False)
    activity_read_all = models.BooleanField(default=False)
    activity_write = models.BooleanField(default=False)

    def set_scope(self, scope_str):
        if scope_str:
            scopes = scope_str.split(',')
            self.read = 'read' in scopes
            self.read_all = 'read_all' in scopes
            self.profile_read_all = 'profile:read_all' in scopes
            self.profile_write = 'profile:write' in scopes
            self.activity_read_all = 'activity:read_all' in scopes
            self.activity_write = 'activity:write' in scopes

class StravaRefreshToken(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    refresh_token = models.CharField(null=True)
