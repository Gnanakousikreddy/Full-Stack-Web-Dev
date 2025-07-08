from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    UploadVideoView,
    VideoListView,
    VideoDetailView,
    WatchLaterView,
    AddRemoveWatchLater,
    UserVideoListView,
    LikeToggleView,
    MyTokenObtainPairView,
    VideoCommentsView,
)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Videos
    path('videos/upload/', UploadVideoView.as_view(), name='video-upload'),
    path('videos/', VideoListView.as_view(), name='video-list'),
    path('videos/<int:pk>/', VideoDetailView.as_view(), name='video-detail'),
    path('videos/user/', UserVideoListView.as_view(), name='user-video-list'),
    path('videos/<int:video_id>/like-toggle/', LikeToggleView.as_view(), name='video-like-toggle'),
    path('videos/<int:video_id>/comments/', VideoCommentsView.as_view(), name='video-comments'),

    # Watch Later
    path('watch-later/', WatchLaterView.as_view(), name='watch-later'),
    path('watch-later/toggle/', AddRemoveWatchLater.as_view(), name='add-remove-watch-later'),

    
]
