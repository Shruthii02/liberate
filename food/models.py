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
        ('PARTIALLY_CLAIMED', 'Partially Claimed'),
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
<<<<<<< HEAD
    remaining_quantity = models.PositiveIntegerField(default=0)
=======
    remaining_quantity = models.IntegerField(default=0)
>>>>>>> frontend/feat/food
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
        if self._state.adding:
<<<<<<< HEAD
            if not self.remaining_quantity:
=======
            if self.remaining_quantity is None or self.remaining_quantity == 0:
>>>>>>> frontend/feat/food
                self.remaining_quantity = self.quantity
            self.expires_at = timezone.now() + timezone.timedelta(hours=self.expiry_hours)
        super().save(*args, **kwargs)

    def update_status_from_remaining(self):
        if self.remaining_quantity <= 0:
            self.status = 'CLAIMED'
        elif self.remaining_quantity < self.quantity:
            self.status = 'PARTIALLY_CLAIMED'
        elif self.status in ('PARTIALLY_CLAIMED', 'CLAIMED'):
            self.status = 'AVAILABLE'

    def __str__(self):
        return f'{self.food_name} ({self.quantity} {self.quantity_unit})'


class FoodClaim(models.Model):
    RESPONSE_CHOICES = (
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    )

    food_listing = models.ForeignKey(
        FoodListing,
        on_delete=models.CASCADE,
        related_name='claims',
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='food_claims',
    )
    response = models.CharField(max_length=20, choices=RESPONSE_CHOICES)
    accepted_quantity = models.PositiveIntegerField(null=True, blank=True)
    receiver_full_name = models.CharField(max_length=200)
    organization_name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('food_listing', 'receiver')

    def __str__(self):
        return f'{self.receiver.username} - {self.response} - {self.food_listing.food_name}'
