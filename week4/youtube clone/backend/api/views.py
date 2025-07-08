from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Video
from .serializers import VideoSerializer

from rest_framework.generics import ListAPIView, RetrieveAPIView, ListCreateAPIView


from .models import WatchLater, Video
from .serializers import WatchLaterSerializer

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import MyTokenObtainPairSerializer


from .models import Comment
from .serializers import CommentSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if username is None or password is None:
            return Response({'error': 'Please provide both username and password'},
                            status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'},
                            status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username)
        user.set_password(password)
        user.save()

        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)


class UploadVideoView(CreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        print("Request user:", self.request.user)
        print("Request data:", self.request.data)
        serializer.save(user=self.request.user)

class VideoListView(ListAPIView):
    queryset = Video.objects.all().order_by('-uploaded_at')
    serializer_class = VideoSerializer
    permission_classes = [AllowAny]

class UserVideoListView(ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return videos owned by the logged-in user
        return Video.objects.filter(user=self.request.user)



class VideoDetailView(RetrieveAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [AllowAny]


class WatchLaterView(ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        wl, created = WatchLater.objects.get_or_create(user=self.request.user)
        return wl.videos.all()


class AddRemoveWatchLater(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        video_id = request.data.get('video_id')
        if not video_id:
            return Response({'error': 'Video ID required'}, status=400)

        try:
            video = Video.objects.get(id=video_id)
        except Video.DoesNotExist:
            return Response({'error': 'Video not found'}, status=404)

        wl, created = WatchLater.objects.get_or_create(user=request.user)

        if video in wl.videos.all():
            wl.videos.remove(video)
            return Response({'message': 'Video removed from Watch Later', 'in_watch_later': False})
        else:
            wl.videos.add(video)
            return Response({'message': 'Video added to Watch Later', 'in_watch_later': True})



class LikeToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, video_id):
        try:
            video = Video.objects.get(pk=video_id)
        except Video.DoesNotExist:
            return Response({'error': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if video.likes.filter(id=user.id).exists():
            video.likes.remove(user)
            liked = False
        else:
            video.likes.add(user)
            liked = True

        return Response({
            'liked': liked,
            'like_count': video.like_count()
        })




class VideoCommentsView(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, video_id):
        comments = Comment.objects.filter(video_id=video_id).order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, video_id):
        comment_text = request.data.get('text')
        comment = Comment.objects.create(
            video_id=video_id,
            user=request.user,
            text=comment_text
        )
        serializer = CommentSerializer(comment)
        return Response(serializer.data)