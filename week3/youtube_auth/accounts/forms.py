from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from .models import User

class MyUserCreationForm(UserCreationForm) :
    class Meta :
        model = User
        fields = ['username', 'email', 'avatar', 'password1',
                  'password2', ]
        


        
