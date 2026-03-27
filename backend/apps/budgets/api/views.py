from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.budgets.models import Budget
from apps.budgets.api.serializers import BudgetSerializer


class BudgetViewSet(viewsets.ModelViewSet):
    """
    GET    /api/budgets/        — list all budgets of the authenticated user
    POST   /api/budgets/        — create a new budget
    GET    /api/budgets/{id}/   — retrieve a single budget
    PATCH  /api/budgets/{id}/   — update a budget
    DELETE /api/budgets/{id}/   — delete a budget
    """
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
