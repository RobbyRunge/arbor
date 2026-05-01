from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Category

DEFAULT_CATEGORIES = [
    # Income
    {"name": "Gehalt", "color": "#22c55e", "type": Category.Type.INCOME},
    {"name": "Freelance", "color": "#16a34a", "type": Category.Type.INCOME},
    {"name": "Investitionen", "color": "#15803d", "type": Category.Type.INCOME},
    # Expenditure
    {"name": "Miete", "color": "#6366f1", "type": Category.Type.EXPENSE},
    {"name": "Lebensmittel", "color": "#f59e0b", "type": Category.Type.EXPENSE},
    {"name": "Transport", "color": "#3b82f6", "type": Category.Type.EXPENSE},
    {"name": "Restaurants", "color": "#ef4444", "type": Category.Type.EXPENSE},
    {"name": "Gesundheit", "color": "#ec4899", "type": Category.Type.EXPENSE},
    {"name": "Unterhaltung", "color": "#8b5cf6", "type": Category.Type.EXPENSE},
    {"name": "Shopping", "color": "#f97316", "type": Category.Type.EXPENSE},
    {"name": "Reisen", "color": "#06b6d4", "type": Category.Type.EXPENSE},
    {"name": "Versicherung", "color": "#64748b", "type": Category.Type.EXPENSE},
    {"name": "Bildung", "color": "#a855f7", "type": Category.Type.EXPENSE},
]


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_default_categories(sender, instance, created, **kwargs):
    # Only runs when a new user is created, not on every save
    if created:
        Category.objects.bulk_create(
            [Category(user=instance, **data) for data in DEFAULT_CATEGORIES]
        )
