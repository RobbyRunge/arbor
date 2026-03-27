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
        return Transaction.objects.filter(user=self.request.user)
                                                                                                    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
