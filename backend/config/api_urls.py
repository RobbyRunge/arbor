from django.urls import path, include

urlpatterns = [
    path("auth/", include("apps.users.api.urls")),
    path("", include("apps.accounts.api.urls")),
    path("", include("apps.categories.api.urls")),
    path("", include("apps.transactions.api.urls")),
    path("", include("apps.budgets.api.urls")),
    path("", include("apps.notifications.api.urls")),
]
