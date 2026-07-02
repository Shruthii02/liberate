from django.urls import path

from .views import FoodListingCreateView, FoodListingDetailView, FoodListingMineView

urlpatterns = [
    path('listings/', FoodListingCreateView.as_view(), name='food-listing-create'),
    path('listings/mine/', FoodListingMineView.as_view(), name='food-listing-mine'),
    path('listings/<int:pk>/', FoodListingDetailView.as_view(), name='food-listing-detail'),
]
