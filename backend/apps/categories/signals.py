from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Category

DEFAULT_CATEGORIES = [
    # Income
    {"name": "Salary",      "icon": "briefcase",    "color": "#22c55e", "type": Category.Type.INCOME},
    {"name": "Freelance",   "icon": "laptop",       "color": "#16a34a", "type": Category.Type.INCOME},
    {"name": "Investments", "icon": "trending-up",  "color": "#15803d", "type": Category.Type.INCOME},
    # Expenses
    {"name": "Rent",          "icon": "home",          "color": "#6366f1", "type": Category.Type.EXPENSE},
    {"name": "Groceries",     "icon": "shopping-cart", "color": "#f59e0b", "type": Category.Type.EXPENSE},
    {"name": "Transport",     "icon": "car",           "color": "#3b82f6", "type": Category.Type.EXPENSE},
    {"name": "Restaurants",   "icon": "utensils",      "color": "#ef4444", "type": Category.Type.EXPENSE},
    {"name": "Health",        "icon": "heart-pulse",   "color": "#ec4899", "type": Category.Type.EXPENSE},
    {"name": "Entertainment", "icon": "tv",            "color": "#8b5cf6", "type": Category.Type.EXPENSE},
    {"name": "Shopping",      "icon": "bag",           "color": "#f97316", "type": Category.Type.EXPENSE},
    {"name": "Travel",        "icon": "plane",         "color": "#06b6d4", "type": Category.Type.EXPENSE},
    {"name": "Insurance",     "icon": "shield",        "color": "#64748b", "type": Category.Type.EXPENSE},
    {"name": "Education",     "icon": "book-open",     "color": "#a855f7", "type": Category.Type.EXPENSE},
]


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_default_categories(sender, instance, created, **kwargs):
    # Only runs when a new user is created, not on every save
    if created:
        Category.objects.bulk_create([
            Category(user=instance, **data) for data in DEFAULT_CATEGORIES
        ])
