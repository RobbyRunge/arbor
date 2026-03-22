from django.conf import settings
from django.db import models


class Category(models.Model):

    class Type(models.TextChoices):
        INCOME = "income", "Income"
        EXPENSE = "expense", "Expense"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="categories",
    )
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=100, default="tag")
    color = models.CharField(max_length=7, default="#6366f1")  # hex color
    type = models.CharField(max_length=10, choices=Type.choices)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ["type", "name"]
        unique_together = [["user", "name", "type"]]  # no duplicate names per user per type

    def __str__(self):
        return f"{self.user.email} — {self.name} ({self.type})"
