from django.urls import path, include

urlpatterns = [
    path("auth/", include("apps.users.urls")),
    path("accounts/", include("apps.accounts.urls")),
    path("categories/", include("apps.categories.urls")),
    path("transactions/", include("apps.transactions.urls")),
    path("budgets/", include("apps.budgets.urls")),
    path("notifications/", include("apps.notifications.urls")),
]
