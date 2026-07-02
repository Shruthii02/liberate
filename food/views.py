from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import FoodListing
from .permissions import IsDonor, IsDonorOwner
from .serializers import FoodListingSerializer


class FoodListingCreateView(generics.CreateAPIView):
    serializer_class = FoodListingSerializer
    permission_classes = [IsDonor]


class FoodListingMineView(generics.ListAPIView):
    serializer_class = FoodListingSerializer
    permission_classes = [IsDonor]

    def get_queryset(self):
        return FoodListing.objects.filter(donor=self.request.user).select_related(
            'location', 'donor'
        )


class FoodListingDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = FoodListingSerializer
    permission_classes = [IsAuthenticated, IsDonorOwner]

    def get_queryset(self):
        return FoodListing.objects.filter(donor=self.request.user).select_related(
            'location', 'donor'
        )
