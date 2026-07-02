from django.contrib import admin

from .models import FoodListing


@admin.register(FoodListing)
class FoodListingAdmin(admin.ModelAdmin):
    list_display = (
        'food_name',
        'donor',
        'quantity',
        'quantity_unit',
        'status',
        'expires_at',
        'created_at',
    )
    list_filter = ('status', 'quantity_unit')
    search_fields = ('food_name', 'organization_event_name', 'donor__username')
