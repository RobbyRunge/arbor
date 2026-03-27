from rest_framework import serializers

from apps.budgets.models import Budget
from apps.categories.api.serializers import CategorySerializer


class BudgetSerializer(serializers.ModelSerializer):
    """Serializer for Budget model."""

    category_detail = CategorySerializer(source="category", read_only=True)

    class Meta:
        model = Budget
        fields = [
            "id", "category", "category_detail",
            "amount", "month", "year", "notification_threshold"
        ]
        read_only_fields = ["id", "category_detail"]
