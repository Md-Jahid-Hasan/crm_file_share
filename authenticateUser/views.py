from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework import status, permissions, viewsets

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, OutstandingToken, BlacklistedToken
from django.contrib.auth import get_user_model as User

from .serializers import MyTokenObtainPairSerializer, UserCreateSerializer, UserDetailsSerializer


class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserCreateView(CreateAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.IsAdminUser, ]


class RetrieveUserView(RetrieveAPIView):
    serializer_class = UserDetailsSerializer
    permission_classes = (IsAuthenticated, )

    def get_object(self):
        return self.request.user


class UserView(viewsets.ModelViewSet):
    serializer_class = UserCreateSerializer
    queryset = User().objects.all()
    permission_classes = [IsAuthenticated, ]

    def get_object(self):
        return self.request.user

    def get_permissions(self):
        if self.action == 'create':
            self.permission_classes = (AllowAny, )
        elif self.action == 'list':
            self.permission_classes = (IsAdminUser, )
        return super(UserView, self).get_permissions()


class LogOutView(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request):
        refresh_token = request.data['refresh']
        token = RefreshToken(refresh_token)
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class LogOutAllView(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request):
        tokens = OutstandingToken.objects.filter(user_id=request.user.id)
        for token in tokens:
            t, _ = BlacklistedToken.objects.get_or_create(token=token)
        return Response(status=status.HTTP_205_RESET_CONTENT)


