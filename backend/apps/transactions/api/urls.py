from rest_framework.routers import DefaultRouter

from apps.transactions.api.views import TransactionViewSet                                           

router = DefaultRouter()                                                                             
router.register(r"transactions", TransactionViewSet, basename="transaction")

urlpatterns = router.urls