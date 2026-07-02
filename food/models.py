from django.conf import settings
from django.db import models
from django.utils import timezone

from location.models import Location


class FoodListing(models.Model):
    QUANTITY_UNIT_CHOICES = (
        ('PLATES', 'Plates'),
        ('KG', 'Kg'),
        ('BOXES', 'Boxes'),
        ('PACKETS', 'Packets'),
        ('LITERS', 'Liters'),
        ('OTHER', 'Other'),
    )

    STATUS_CHOICES = (
        ('AVAILABLE', 'Available'),
        ('CLAIMED', 'Claimed'),
        ('EXPIRED', 'Expired'),
        ('CANCELLED', 'Cancelled'),
    )

    donor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='food_listings',
    )
    location = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name='food_listings',
    )
    organization_event_name = models.CharField(max_length=200)
    food_name = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField()
    quantity_unit = models.CharField(max_length=20, choices=QUANTITY_UNIT_CHOICES)
    expiry_hours = models.PositiveIntegerField()
    expires_at = models.DateTimeField()
    other_details = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='AVAILABLE',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self._state.adding or self.expiry_hours:
            self.expires_at = timezone.now() + timezone.timedelta(hours=self.expiry_hours)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.food_name} ({self.quantity} {self.quantity_unit})'
