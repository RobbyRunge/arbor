from rest_framework import viewsets                                                                  
from rest_framework.permissions import IsAuthenticated                                               
from apps.categories.models import Category                                                          
from apps.categories.api.serializers import CategorySerializer

class CategoryViewSet(viewsets.ModelViewSet):                                                        
    """                                                                                              
    GET    /api/categories/        — list all categories of the authenticated user                   
    POST   /api/categories/        — create a new category                                           
    GET    /api/categories/{id}/   — retrieve a single category
    PATCH  /api/categories/{id}/   — update a category                                               
    DELETE /api/categories/{id}/   — delete a category                                               
    """
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)