from django.db import transaction
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import ReceiverProfile

from .models import FoodClaim, FoodListing
from .permissions import IsDonor, IsDonorOwner, IsReceiver
from .serializers import (
    AvailableFoodListingSerializer,
    FoodClaimRespondSerializer,
    FoodClaimResponseSerializer,
    FoodListingSerializer,
)


class FoodListingCreateView(generics.CreateAPIView):
    serializer_class = FoodListingSerializer
    permission_classes = [IsDonor]


class FoodListingMineView(generics.ListAPIView):
    serializer_class = FoodListingSerializer
    permission_classes = [IsDonor]

    def get_queryset(self):
        return FoodListing.objects.filter(donor=self.request.user).select_related(
            'location', 'donor'
        ).prefetch_related('claims', 'claims__receiver')


class FoodListingDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = FoodListingSerializer
    permission_classes = [IsAuthenticated, IsDonorOwner]

    def get_queryset(self):
        return FoodListing.objects.filter(donor=self.request.user).select_related(
            'location', 'donor'
        ).prefetch_related('claims', 'claims__receiver')


class AvailableFoodListingListView(generics.ListAPIView):
    serializer_class = AvailableFoodListingSerializer
    permission_classes = [IsReceiver]

    def get_queryset(self):
        responded_ids = FoodClaim.objects.filter(
            receiver=self.request.user
        ).values_list('food_listing_id', flat=True)

        return FoodListing.objects.filter(
            status__in=('AVAILABLE', 'PARTIALLY_CLAIMED'),
            remaining_quantity__gt=0,
        ).exclude(
            id__in=responded_ids
        ).select_related('location').order_by('-created_at')


class AvailableFoodListingDetailView(generics.RetrieveAPIView):
    serializer_class = AvailableFoodListingSerializer
    permission_classes = [IsReceiver]
    lookup_url_kwarg = 'pk'

    def get_queryset(self):
        responded_ids = FoodClaim.objects.filter(
            receiver=self.request.user
        ).values_list('food_listing_id', flat=True)

        return FoodListing.objects.filter(
            status__in=('AVAILABLE', 'PARTIALLY_CLAIMED'),
            remaining_quantity__gt=0,
        ).exclude(
            id__in=responded_ids
        ).select_related('location')


class FoodListingRespondView(APIView):
    permission_classes = [IsReceiver]

    def post(self, request, pk):
        serializer = FoodClaimRespondSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        response_type = serializer.validated_data['response']
        accepted_quantity = serializer.validated_data.get('accepted_quantity')

        try:
            profile = request.user.receiver_profile
        except ReceiverProfile.DoesNotExist:
            profile = None

        if response_type == 'ACCEPTED' and (profile is None or not profile.is_complete):
            return Response(
                {
                    'detail': (
                        'Receiver profile is incomplete. Please provide full name, '
                        'organization, and ID card before accepting.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        receiver_full_name = profile.full_name if profile else request.user.username
        organization_name = profile.organization_name if profile else 'N/A'

        if FoodClaim.objects.filter(food_listing_id=pk, receiver=request.user).exists():
            return Response(
                {'detail': 'You have already responded to this listing.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            try:
                listing = FoodListing.objects.select_for_update().get(pk=pk)
            except FoodListing.DoesNotExist:
                return Response(
                    {'detail': 'Listing not found.'},
                    status=status.HTTP_404_NOT_FOUND,
                )

            if listing.status not in ('AVAILABLE', 'PARTIALLY_CLAIMED'):
                return Response(
                    {'detail': 'This listing is no longer available.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if response_type == 'ACCEPTED':
                if listing.remaining_quantity <= 0:
                    return Response(
                        {'detail': 'No quantity remaining on this listing.'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                if accepted_quantity > listing.remaining_quantity:
                    return Response(
                        {
                            'accepted_quantity': (
                                f'Cannot accept more than remaining quantity '
                                f'({listing.remaining_quantity}).'
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                listing.remaining_quantity -= accepted_quantity
                listing.update_status_from_remaining()
                listing.save(update_fields=['remaining_quantity', 'status', 'updated_at'])

            claim = FoodClaim.objects.create(
                food_listing=listing,
                receiver=request.user,
                response=response_type,
                accepted_quantity=accepted_quantity if response_type == 'ACCEPTED' else None,
                receiver_full_name=receiver_full_name,
                organization_name=organization_name,
            )

        return Response(
            FoodClaimResponseSerializer(claim).data,
            status=status.HTTP_201_CREATED,
        )
