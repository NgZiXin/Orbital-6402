from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners(check by username) of an object to read or edit it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.username == request.user.username