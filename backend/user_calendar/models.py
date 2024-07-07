from django.db import models
from accounts.models import CustomUser

class Calendar(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField()
    header = models.CharField(max_length=80)
    body = models.CharField(blank=True)

    