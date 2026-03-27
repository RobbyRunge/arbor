from rest_framework import serializers
from apps.accounts.models import Account

class AccountSerializer(serializers.ModelSerializer):
    """Serializer for Account model."""

    class Meta:
        model = Account
        fields = ["id", "name", "type", "balance", "icon", "color"]
        read_only_fields = ["id", "balance"]
