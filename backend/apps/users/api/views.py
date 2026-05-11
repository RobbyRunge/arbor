from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

from apps.users.models import User
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)


class LoginView(APIView):
    """
    POST /api/auth/login/
    Authenticates the user and sets httpOnly JWT cookies.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = TokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        response = Response({"detail": "Login erfolgreich."})
        response.set_cookie(
            "access_token",
            serializer.validated_data["access"],
            httponly=True,
            samesite="Lax",
            secure=False,  # in production: True
        )
        response.set_cookie(
            "refresh_token",
            serializer.validated_data["refresh"],
            httponly=True,
            samesite="Lax",
            secure=False,
        )
        return response


class RefreshView(APIView):
    """
    POST /api/auth/token/refresh/
    Reads the refresh_token cookie and sets a new access_token cookie.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        from rest_framework_simplejwt.tokens import RefreshToken
        from rest_framework_simplejwt.exceptions import TokenError

        raw_token = request.COOKIES.get("refresh_token")
        if not raw_token:
            return Response(
                {"detail": "Kein Refresh-Token."}, status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            token = RefreshToken(raw_token)
        except TokenError:
            return Response(
                {"detail": "Ungültiger Token."}, status=status.HTTP_401_UNAUTHORIZED
            )

        response = Response({"detail": "Token erneuert."})
        response.set_cookie(
            "access_token",
            str(token.access_token),
            httponly=True,
            samesite="Lax",
            secure=False,
        )
        return response


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Clears both JWT cookies.
    """

    def post(self, request):
        response = Response({"detail": "Abgemeldet."})
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/
    Creates a new user account. No authentication required.
    """

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        from datetime import date

        user = serializer.save()
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = PasswordResetTokenGenerator().make_token(user)
        verification_url = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"
        context = {
            "first_name": user.first_name or user.email,
            "verification_url": verification_url,
            "year": date.today().year,
        }
        html_body = render_to_string("emails/verify_email.html", context)
        plain_body = (
            f"Hallo {context['first_name']},\n\n"
            f"klicke auf den folgenden Link, um deine E-Mail-Adresse zu bestätigen:\n\n"
            f"{verification_url}\n\n"
            f"Der Link ist 24 Stunden gültig.\n\n"
            f"Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren."
        )
        msg = EmailMultiAlternatives(
            subject="E-Mail-Adresse bestätigen – Arbor",
            body=plain_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        msg.attach_alternative(html_body, "text/html")
        msg.send(fail_silently=True)


class MeView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/auth/me/  — returns the current user's profile
    PATCH /api/auth/me/ — updates first_name / last_name
    """

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "head", "options"]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """
    POST /api/auth/change-password/
    Requires current password + new password (confirmed).
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Password changed successfully."}, status=status.HTTP_200_OK
        )


class PasswordResetRequestView(APIView):
    """
    POST /api/auth/password-reset/
    Sends a password reset email if the given address is registered.
    Always returns 200 to avoid leaking whether an email exists.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = PasswordResetTokenGenerator().make_token(user)
            reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
            try:
                from datetime import date

                context = {
                    "first_name": user.first_name or user.email,
                    "reset_url": reset_url,
                    "year": date.today().year,
                }
                html_body = render_to_string("emails/password_reset.html", context)
                plain_body = (
                    f"Hallo {context['first_name']},\n\n"
                    f"klicke auf den folgenden Link, um dein Passwort zurückzusetzen:\n\n"
                    f"{reset_url}\n\n"
                    f"Der Link ist 24 Stunden gültig.\n\n"
                    f"Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren."
                )
                msg = EmailMultiAlternatives(
                    subject="Passwort zurücksetzen – Arbor",
                    body=plain_body,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[email],
                )
                msg.attach_alternative(html_body, "text/html")
                msg.send(fail_silently=False)
            except Exception:
                return Response(
                    {
                        "detail": "E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut."
                    },
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )
        except User.DoesNotExist:
            pass
        return Response(
            {
                "detail": "Falls ein Konto mit dieser Adresse existiert, erhältst du in Kürze eine E-Mail."
            },
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    """
    POST /api/auth/password-reset/confirm/
    Validates the uid + token and sets the new password.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Passwort erfolgreich geändert."}, status=status.HTTP_200_OK
        )


class VerifyEmailView(APIView):
    """
    GET /api/auth/verify-email/<uidb64>/<token>/
    Validates the token and marks the user's email as verified.
    """

    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"detail": "Ungültiger Verifizierungs-Link."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response(
                {"detail": "Verifizierungs-Link ist abgelaufen oder ungültig."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.is_verified = True
        user.save()
        return Response({"detail": "E-Mail-Adresse erfolgreich bestätigt."})
