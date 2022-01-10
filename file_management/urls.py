from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import FileViewSets, AllFIle, UpdateFileViewSets

router = DefaultRouter()
router.register(r'user_file', FileViewSets, basename='base_folder')
router.register(r'file_user', UpdateFileViewSets, basename='file_folder')

urlpatterns = [
    path('', include(router.urls)),
    path('all-file/', AllFIle.as_view()),
]
