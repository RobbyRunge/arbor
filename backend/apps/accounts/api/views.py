from rest_framework import viewsets                                                                  
from rest_framework.permissions import IsAuthenticated                                               
from apps.accounts.models import Account                                                          
from apps.accounts.api.serializers import AccountSerializer

class AccountViewSet(viewsets.ModelViewSet):                                                        
    """                                                                                              
    GET    /api/accounts/        — list all accounts of the authenticated user                   
    POST   /api/accounts/        — create a new account                                           
    GET    /api/accounts/{id}/   — retrieve a single account
    PATCH  /api/accounts/{id}/   — update a account                                               
    DELETE /api/accounts/{id}/   — delete a account                                               
    """
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)