from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import ReceiverProfile, User


class CustomUserAdmin(UserAdmin):

    list_display = (
        'username',
        'email',
        'role',
    )

    fieldsets = UserAdmin.fieldsets + (
        (
            'Additional Info',
            {
                'fields': (
                    'role',
                    'phone',
                    'latitude',
                    'longitude',
                    'reward_points',
                )
            },
        ),
    )


@admin.register(ReceiverProfile)
class ReceiverProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'organization_name', 'user', 'updated_at')
    search_fields = ('full_name', 'organization_name', 'user__username')


admin.site.register(User, CustomUserAdmin)