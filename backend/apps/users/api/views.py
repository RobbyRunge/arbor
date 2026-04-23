from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.users.models import User
from .serializers import RegisterSerializer, UserSerializer, ChangePasswordSerializer


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
