from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import FileViewSets

router = DefaultRouter()
router.register(r'user_file', FileViewSets, basename='base_folder')

urlpatterns = [
    path('', include(router.urls)),
]
