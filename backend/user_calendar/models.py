from django.db import models
from accounts.models import CustomUser

class Calendar(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.CharField(max_length=10)  #Eg: 0800
    end_time = models.CharField(max_length=10)  #Eg: 1000
    header = models.CharField(max_length=80)
    body = models.CharField(blank=True)

    