from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsDonor(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'DONOR'
        )


class IsReceiver(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'RECEIVER'
        )


class IsDonorOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return obj.donor == request.user
        return (
            obj.donor == request.user
            and obj.status in ('AVAILABLE', 'CANCELLED', 'PARTIALLY_CLAIMED')
        )
