from django.urls import path, include
from .views import LoginView, UserCreateView, RetrieveUserView, LogOutView, LogOutAllView, \
    UserView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

app_name = 'authenticateUser'

router = DefaultRouter()
router.register(r'user', UserView, basename='base_folder')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name="login"),
    path('token/refresh/', TokenRefreshView.as_view(), name="token-refresh"),
    path('logout/', LogOutView.as_view(), name="logout"),
    path('logout_all/', LogOutAllView.as_view(), name="logout_all"),
    path('create-user/', UserCreateView.as_view(), name="create-user"),
    path('me/', RetrieveUserView.as_view(), name="me"),
]
