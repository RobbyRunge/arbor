from rest_framework import serializers

from apps.transactions.models import Transaction                                                     
from apps.accounts.api.serializers import AccountSerializer                                          
from apps.categories.api.serializers import CategorySerializer        
from apps.categories.models import Category                           

                                                                                                    
class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for Transaction model."""
                                                                                                    
    account_detail = AccountSerializer(source="account", read_only=True)
    category_detail = CategorySerializer(source="category", read_only=True)      
    category = serializers.PrimaryKeyRelatedField(                                                       
      queryset=Category.objects.all(),                                                                 
      required=False,
      allow_null=True                                                                                  
    )                     
                
    class Meta:
        model = Transaction
        fields = [
            "id", "account", "category",                                                             
            "account_detail", "category_detail",
            "amount", "type", "date", "description"                                                  
        ]       
        read_only_fields = ["id", "account_detail", "category_detail"]
                                                                                                    