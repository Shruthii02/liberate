from django.contrib import admin

from .models import Location


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('address', 'latitude', 'longitude', 'landmark', 'created_at')
    search_fields = ('address', 'landmark')
