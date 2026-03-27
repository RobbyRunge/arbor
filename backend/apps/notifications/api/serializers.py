from rest_framework import serializers

from apps.notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model."""

    class Meta:
        model = Notification
        fields = ["id", "budget", "type", "message", "is_read", "created_at"]
        read_only_fields = ["id", "budget", "type", "message", "created_at"]
