from django.urls import path
from .views import get_user, create_user, user_detail

urlpatterns = [
    path('users/', get_user, name = "get_user"),
    path('users/create/', create_user, name = "create-user"),
    path('users/<str:pk>', user_detail, name = 'user-detail'),
]
