from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")

# ─── Security ────────────────────────────────────────────────────────────────

SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")

DEBUG = os.getenv("DEBUG", "True") == "True"

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")


# ─── Apps ─────────────────────────────────────────────────────────────────────

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    # Local
    "apps.users",
    "apps.accounts",
    "apps.categories",
    "apps.transactions",
    "apps.budgets",
    "apps.notifications",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # muss vor CommonMiddleware stehen
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# ─── Custom User Model ────────────────────────────────────────────────────────
# Sagt Django: nutze unsere eigene User-Klasse statt der Standard-Django-User.
# WICHTIG: muss gesetzt sein bevor die erste Migration läuft.

AUTH_USER_MODEL = "users.User"


# ─── Database ─────────────────────────────────────────────────────────────────
# PostgreSQL. Zugangsdaten kommen aus .env, nie aus dem Code.

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "arbor"),
        "USER": os.getenv("DB_USER", "postgres"),
        "PASSWORD": os.getenv("DB_PASSWORD", ""),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}


# ─── Password Validation ──────────────────────────────────────────────────────

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ─── Internationalization ─────────────────────────────────────────────────────

LANGUAGE_CODE = "de-de"
TIME_ZONE = "Europe/Berlin"
USE_I18N = True
USE_TZ = True


# ─── Static Files ─────────────────────────────────────────────────────────────

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ─── Django REST Framework ────────────────────────────────────────────────────
# Alle API-Endpunkte verlangen standardmäßig ein gültiges JWT.
# Ausnahmen (Login, Register) werden in den Views explizit freigegeben.

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}


# ─── JWT (SimpleJWT) ──────────────────────────────────────────────────────────
# Access Token: kurzlebig (15 Min) → wenn abgefangen, schnell wertlos
# Refresh Token: länger (7 Tage) → wird genutzt um neuen Access Token zu holen

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,       # neuer Refresh Token bei jedem Refresh
    "BLACKLIST_AFTER_ROTATION": False,   # kein Blacklist-Modul nötig vorerst
    "AUTH_HEADER_TYPES": ("Bearer",),
}


# ─── CORS ─────────────────────────────────────────────────────────────────────
# CORS = Cross-Origin Resource Sharing.
# Ohne diese Einstellung würde der Browser alle Requests vom React-Frontend
# (localhost:5173) blockieren, weil Backend (localhost:8000) und Frontend
# auf verschiedenen Ports laufen → gelten als verschiedene "Origins".

CORS_ALLOWED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")


# ─── Email ────────────────────────────────────────────────────────────────────
# Für Passwort-Reset. Im Development landen Mails in der Konsole.

EMAIL_BACKEND = os.getenv(
    "EMAIL_BACKEND",
    "django.core.mail.backends.console.EmailBackend",
)
EMAIL_HOST = os.getenv("EMAIL_HOST", "")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True") == "True"
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "noreply@arbor.app")


# ─── Celery ───────────────────────────────────────────────────────────────────
# Celery verarbeitet Hintergrundaufgaben (z.B. PDF-Export, CSV-Import).
# Redis dient als "Broker" — die Warteschlange zwischen Django und Celery.

CELERY_BROKER_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE
