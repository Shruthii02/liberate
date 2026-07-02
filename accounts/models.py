from django.contrib.auth.models import AbstractUser
from django.conf import settings
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


class ReceiverProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='receiver_profile',
    )
    full_name = models.CharField(max_length=200)
    organization_name = models.CharField(max_length=200)
    id_card = models.ImageField(upload_to='id_cards/')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.full_name} ({self.organization_name})'

    @property
    def is_complete(self):
        return bool(self.full_name and self.organization_name and self.id_card)