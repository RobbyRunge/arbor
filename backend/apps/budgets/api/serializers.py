from rest_framework import serializers
from django.db.models import Sum

from apps.budgets.models import Budget
from apps.categories.api.serializers import CategorySerializer


class BudgetSerializer(serializers.ModelSerializer):
    """Serializer for Budget model."""

    category_detail = CategorySerializer(source="category", read_only=True)
    spent = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = [
            "id",
            "category",
            "category_detail",
            "amount",
            "month",
            "year",
            "spent",
            "notification_threshold",
        ]
        read_only_fields = ["id", "category_detail"]

    def get_spent(self, obj):
        from apps.transactions.models import Transaction

        result = Transaction.objects.filter(
            category=obj.category,
            date__month=obj.month,
            date__year=obj.year,
            type="expense",
        ).aggregate(Sum("amount"))["amount__sum"]

        return result or 0
