from django.urls import path, include

urlpatterns = [
    path("auth/", include("apps.users.api.urls")),
    path("accounts/", include("apps.accounts.urls")),
    path("", include("apps.categories.api.urls")),
    path("transactions/", include("apps.transactions.urls")),
    path("budgets/", include("apps.budgets.urls")),
    path("notifications/", include("apps.notifications.urls")),
]
