from django.db import models
from django.contrib.auth.models import User

def video_directory_path(instance, filename):
    # Upload to: MEDIA_ROOT/user_<id>/<filename>
    return f'user_{instance.user.id}/{filename}'

class Video(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    video_file = models.FileField(upload_to=video_directory_path)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    likes = models.ManyToManyField(User, related_name='liked_videos', blank=True)

    def like_count(self) :
        return self.likes.count()

    def __str__(self):
        return self.title

class WatchLater(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    videos = models.ManyToManyField(Video, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Watch Later"


class Comment(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    