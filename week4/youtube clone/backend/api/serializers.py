from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Video, WatchLater, Comment
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add extra claims to token if needed
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username  # ✅ Add username here!
        return data




class VideoSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'id',
            'user',
            'title',
            'description',
            'video_file',
            'thumbnail',
            'uploaded_at',
            'like_count',
            'is_liked',
        ]

    def get_like_count(self, obj):
        return obj.like_count()

    def get_is_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return obj.likes.filter(id=user.id).exists()
        return False

class WatchLaterSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)

    class Meta:
        model = WatchLater
        fields = ['videos']


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'username', 'text', 'created_at']


