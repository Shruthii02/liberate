from rest_framework import serializers

from location.serializers import LocationSerializer
from location.models import Location

from .models import FoodClaim, FoodListing


class ReceiverLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('address', 'landmark')


class FoodClaimSerializer(serializers.ModelSerializer):
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)

    class Meta:
        model = FoodClaim
        fields = (
            'id',
            'receiver_username',
            'response',
            'accepted_quantity',
            'receiver_full_name',
            'organization_name',
            'created_at',
        )


class FoodListingSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    donor_username = serializers.CharField(source='donor.username', read_only=True)
    donor_id = serializers.IntegerField(source='donor.id', read_only=True)
    claims = FoodClaimSerializer(many=True, read_only=True)

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
            'remaining_quantity',
            'quantity_unit',
            'expiry_hours',
            'expires_at',
            'other_details',
            'status',
            'claims',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'id',
            'donor_id',
            'donor_username',
            'remaining_quantity',
            'expires_at',
            'claims',
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
        validated_data['remaining_quantity'] = validated_data['quantity']
        return FoodListing.objects.create(**validated_data)

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)
        if location_data:
            for attr, value in location_data.items():
                setattr(instance.location, attr, value)
            instance.location.save()

        validated_data.pop('remaining_quantity', None)
        validated_data.pop('quantity', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if (
            instance.remaining_quantity < instance.quantity
            and validated_data.get("status") == "AVAILABLE"
        ):
            instance.update_status_from_remaining()

        return instance


class AvailableFoodListingSerializer(serializers.ModelSerializer):
    location = ReceiverLocationSerializer(read_only=True)

    class Meta:
        model = FoodListing
        fields = (
            'id',
            'organization_event_name',
            'food_name',
            'quantity',
            'remaining_quantity',
            'quantity_unit',
            'expires_at',
            'other_details',
            'status',
            'location',
            'created_at',
        )


class FoodClaimRespondSerializer(serializers.Serializer):
    response = serializers.ChoiceField(choices=FoodClaim.RESPONSE_CHOICES)
    accepted_quantity = serializers.IntegerField(required=False, min_value=1)

    def validate(self, attrs):
        if attrs['response'] == 'ACCEPTED' and not attrs.get('accepted_quantity'):
            raise serializers.ValidationError(
                {'accepted_quantity': 'This field is required when accepting.'}
            )
        if attrs['response'] == 'REJECTED':
            attrs['accepted_quantity'] = None
        return attrs


class FoodClaimResponseSerializer(serializers.ModelSerializer):
    listing = AvailableFoodListingSerializer(source='food_listing', read_only=True)

    class Meta:
        model = FoodClaim
        fields = (
            'id',
            'response',
            'accepted_quantity',
            'receiver_full_name',
            'organization_name',
            'created_at',
            'listing',
        )
