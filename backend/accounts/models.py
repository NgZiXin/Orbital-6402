from django.db import models
from django.contrib.auth.models import AbstractUser

GENDER_CHOICES = [
    ('M', 'Male'),
    ('F', 'Female'),
]

class CustomUser(AbstractUser):
    height = models.FloatField(null=True)
    weight = models.FloatField(null=True)
    birthday = models.DateField(null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='M')
    
    def __str__(self):
        return self.username

