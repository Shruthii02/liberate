from django.db.models.signals import post_save
from django.dispatch import receiver

from accounts.models import User
from notifications.models import Notification

from .models import FoodListing


@receiver(post_save, sender=FoodListing)
def notify_receivers_on_new_listing(sender, instance, created, **kwargs):
    if not created or instance.status != 'AVAILABLE':
        return

    receivers = User.objects.filter(role='RECEIVER', is_active=True)
    notifications = [
        Notification(
            user=receiver,
            food_listing=instance,
            title='New food event available',
            message=(
                f'{instance.food_name} - {instance.remaining_quantity} '
                f'{instance.get_quantity_unit_display()} at {instance.location.address}'
            ),
            notification_type='NEW_LISTING',
        )
        for receiver in receivers
    ]
    Notification.objects.bulk_create(notifications)
