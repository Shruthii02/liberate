from rest_framework import serializers

from .models import ReceiverProfile


class ReceiverProfileSerializer(serializers.ModelSerializer):
    id_card_url = serializers.SerializerMethodField()
    is_complete = serializers.ReadOnlyField()

    class Meta:
        model = ReceiverProfile
        fields = (
            'full_name',
            'organization_name',
            'id_card',
            'id_card_url',
            'is_complete',
            'updated_at',
        )
        read_only_fields = ('updated_at', 'id_card_url', 'is_complete')

    def get_id_card_url(self, obj):
        if obj.id_card:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.id_card.url)
            return obj.id_card.url
        return None

    def validate(self, attrs):
        user = self.context['request'].user
        if user.role != 'RECEIVER':
            raise serializers.ValidationError('Only receivers can manage a receiver profile.')
        return attrs
