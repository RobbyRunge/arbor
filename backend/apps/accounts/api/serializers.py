from rest_framework import serializers
from apps.accounts.models import Account


class AccountSerializer(serializers.ModelSerializer):
    """Serializer for Account model."""

    initial_balance = serializers.DecimalField(
        max_digits=12, decimal_places=2, write_only=True, required=False
    )

    class Meta:
        model = Account
        fields = ["id", "name", "type", "balance", "icon", "color", "initial_balance"]
        read_only_fields = ["id", "balance"]

    def create(self, validated_data):
        initial_balance = validated_data.pop("initial_balance", 0)
        account = Account(**validated_data)
        account.balance = initial_balance
        account.save()
        return account
