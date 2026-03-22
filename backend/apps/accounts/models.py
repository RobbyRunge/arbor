from django.conf import settings
from django.db import models


class Account(models.Model):

    class Type(models.TextChoices):
        CHECKING = "checking", "Checking"
        SAVINGS = "savings", "Savings"
        CASH = "cash", "Cash"
        CREDIT_CARD = "credit_card", "Credit Card"
        INVESTMENT = "investment", "Investment"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="accounts",
    )
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=Type.choices)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    icon = models.CharField(max_length=100, default="wallet")
    color = models.CharField(max_length=7, default="#6366f1")

    class Meta:
        verbose_name = "Account"
        verbose_name_plural = "Accounts"
        ordering = ["name"]

    def __str__(self):
        return f"{self.user.email} — {self.name}"
