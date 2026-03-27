from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from apps.notifications.models import Notification
from apps.notifications.api.serializers import NotificationSerializer


class NotificationViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    GET   /api/notifications/        — list all notifications of the authenticated user
    GET   /api/notifications/{id}/   — retrieve a single notification
    PATCH /api/notifications/{id}/   — mark notification as read (is_read=true)
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "head", "options"]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
