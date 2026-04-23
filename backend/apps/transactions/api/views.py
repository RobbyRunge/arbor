from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.transactions.models import Transaction
from apps.transactions.api.serializers import TransactionSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    """
    GET    /api/transactions/        — list all transactions of the authenticated user
    POST   /api/transactions/        — create a new transaction
    GET    /api/transactions/{id}/   — retrieve a single transaction
    PATCH  /api/transactions/{id}/   — update a transaction
    DELETE /api/transactions/{id}/   — delete a transaction
    """

    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)

        month = self.request.query_params.get("month")
        if month:
            year, month = month.split("-")
            queryset = queryset.filter(date__year=year, date__month=month)

        transaction_type = self.request.query_params.get("type")
        if transaction_type:
            queryset = queryset.filter(type=transaction_type)

        transaction_category = self.request.query_params.get("category")
        if transaction_category:
            queryset = queryset.filter(category=transaction_category)

        transaction_search = self.request.query_params.get("search")
        if transaction_search:
            queryset = queryset.filter(description__icontains=transaction_search)

        return queryset.order_by("-date")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
