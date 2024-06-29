from django.db import models

# Create your models here.
class OneMapApi(models.Model):
    access_token = models.CharField()
    expiry_date = models.DateTimeField()

    def __str__(self):
        return self.access_token
