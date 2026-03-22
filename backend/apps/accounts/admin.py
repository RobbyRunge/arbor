from django.contrib import admin
from .models import Account


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ["name", "user", "type", "balance"]
    list_filter = ["type"]
    search_fields = ["name", "user__email"]
