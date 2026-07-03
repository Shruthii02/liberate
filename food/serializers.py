from rest_framework import serializers

from location.serializers import LocationSerializer
from location.models import Location

from .models import FoodListing


class FoodListingSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    donor_username = serializers.CharField(source='donor.username', read_only=True)
    donor_id = serializers.IntegerField(source='donor.id', read_only=True)

    class Meta:
        model = FoodListing
        fields = (
            'id',
            'donor_id',
            'donor_username',
            'location',
            'organization_event_name',
            'food_name',
            'quantity',
            'quantity_unit',
            'expiry_hours',
            'expires_at',
            'other_details',
            'status',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'id',
            'donor_id',
            'donor_username',
            'expires_at',
            'created_at',
            'updated_at',
        )

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError('Quantity must be greater than 0.')
        return value

    def validate_expiry_hours(self, value):
        if value <= 0:
            raise serializers.ValidationError('Expiry hours must be greater than 0.')
        return value

    def validate_status(self, value):
        if value not in ('AVAILABLE', 'CANCELLED', "PARTIALLY_CLAIMED",):
            raise serializers.ValidationError(
                'Status must be AVAILABLE, CANCELLED or PARTIALLY_CLAIMED.'
            )
        return value

    def create(self, validated_data):
        location_data = validated_data.pop('location')
        location = Location.objects.create(**location_data)
        validated_data['location'] = location
        validated_data['donor'] = self.context['request'].user
        validated_data.setdefault('status', 'AVAILABLE')
        return FoodListing.objects.create(**validated_data)

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)
        if location_data:
            for attr, value in location_data.items():
                setattr(instance.location, attr, value)
            instance.location.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if (
            instance.remaining_quantity < instance.quantity
            and validated_data.get("status") == "AVAILABLE"
        ):
            instance.update_status_from_remaining()

        return instance
