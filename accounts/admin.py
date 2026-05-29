from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


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


admin.site.register(User, CustomUserAdmin)