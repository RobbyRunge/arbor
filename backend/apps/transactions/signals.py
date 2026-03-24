from django.db.models import Sum
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import Transaction


def recalculate_balance(account):
    """Recalculates and saves the balance of an account from scratch."""
    income = (
        Transaction.objects.filter(account=account, type=Transaction.Type.INCOME)
        .aggregate(total=Sum("amount"))["total"]
        or 0
    )
    expenses = (
        Transaction.objects.filter(account=account, type=Transaction.Type.EXPENSE)
        .aggregate(total=Sum("amount"))["total"]
        or 0
    )
    account.balance = income - expenses
    account.save(update_fields=["balance"])


@receiver(post_save, sender=Transaction)
def on_transaction_save(sender, instance, **kwargs):
    recalculate_balance(instance.account)


@receiver(post_delete, sender=Transaction)
def on_transaction_delete(sender, instance, **kwargs):
    recalculate_balance(instance.account)
