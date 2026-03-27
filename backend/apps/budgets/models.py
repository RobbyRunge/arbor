from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Budget(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="budgets",
    )
    category = models.ForeignKey(
        "categories.Category",
        on_delete=models.CASCADE,
        related_name="budgets",
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    month = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(12)]
    )
    year = models.PositiveSmallIntegerField()
    notification_threshold = models.PositiveSmallIntegerField(
        default=80,
        validators=[MinValueValidator(1), MaxValueValidator(100)],
    )

    class Meta:
        verbose_name = "Budget"
        verbose_name_plural = "Budgets"
        ordering = ["-year", "-month"]
        unique_together = [["user", "category", "month", "year"]]

    def __str__(self):
        return f"{self.user.email} — {self.category.name} {self.month}/{self.year} (limit: {self.amount})"
