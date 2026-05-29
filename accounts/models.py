from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):

    ROLE_CHOICES = (
    ('DONOR', 'Donor'),
    ('RECEIVER', 'Receiver'),
    ('ADMIN', 'Admin'),
            )
          
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    phone = models.CharField(max_length=15)

    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    reward_points = models.IntegerField(default=0)

    def __str__(self):
        return self.username