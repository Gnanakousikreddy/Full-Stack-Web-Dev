from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser) :
    username = models.CharField(max_length=200, null = True, blank=True)
    email = models.CharField(unique=True, null= False, blank=False)
    # bio = models.TextField(null=True)

    avatar = models.ImageField(null=True, upload_to='images/', default="avatar.svg")
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']


