from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    food_listing_id = serializers.IntegerField(source='food_listing.id', read_only=True)

    class Meta:
        model = Notification
        fields = (
            'id',
            'title',
            'message',
            'notification_type',
            'food_listing_id',
            'is_read',
            'created_at',
        )
        read_only_fields = fields
