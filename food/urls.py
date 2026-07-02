from django.urls import path

from .views import (
    AvailableFoodListingDetailView,
    AvailableFoodListingListView,
    FoodListingCreateView,
    FoodListingDetailView,
    FoodListingMineView,
    FoodListingRespondView,
)

urlpatterns = [
    path('listings/', FoodListingCreateView.as_view(), name='food-listing-create'),
    path('listings/mine/', FoodListingMineView.as_view(), name='food-listing-mine'),
    path('listings/available/', AvailableFoodListingListView.as_view(), name='food-listing-available'),
    path(
        'listings/available/<int:pk>/',
        AvailableFoodListingDetailView.as_view(),
        name='food-listing-available-detail',
    ),
    path('listings/<int:pk>/', FoodListingDetailView.as_view(), name='food-listing-detail'),
    path('listings/<int:pk>/respond/', FoodListingRespondView.as_view(), name='food-listing-respond'),
]
