from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    """
    Ersetzt Djangos Standard-UserManager.
    Nötig weil wir email statt username als Pflichtfeld nutzen.
    """

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("E-Mail-Adresse ist erforderlich.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # speichert den Hash, nie das Klartext-PW
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User Model.

    AbstractBaseUser: gibt uns password-Handling, last_login, is_active —
    aber kein username-Feld. Wir definieren selbst was das "Identifikationsfeld" ist.

    PermissionsMixin: fügt is_superuser, groups, user_permissions hinzu —
    nötig für Djangos Admin und Permissions-System.
    """

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    # Sagt Django: nutze email als Login-Feld (statt username)
    USERNAME_FIELD = "email"
    # Felder die bei "createsuperuser" abgefragt werden (außer email + password)
    REQUIRED_FIELDS = ["first_name", "last_name"]

    class Meta:
        verbose_name = "Benutzer"
        verbose_name_plural = "Benutzer"
        ordering = ["-date_joined"]

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
