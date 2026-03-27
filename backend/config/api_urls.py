from django.urls import path, include

urlpatterns = [
    path("auth/", include("apps.users.api.urls")),
    path("", include("apps.accounts.api.urls")),
    path("", include("apps.categories.api.urls")),
    path("", include("apps.transactions.api.urls")),
    path("budgets/", include("apps.budgets.urls")),
    path("notifications/", include("apps.notifications.urls")),
]
