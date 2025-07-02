from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import MyUserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from .models import User


from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
# Create your views here.

def register(request) :

    if request.user.is_authenticated :
        return redirect('dashboard')

    form = MyUserCreationForm()

    if request.method == 'POST' :
        form = MyUserCreationForm(request.POST, request.FILES)
        if form.is_valid() :
            user = form.save(commit=False)
            if user.username :
                user.username = user.username.lower()
            user.save()
            login(request, user)

            messages.success(request, "User created successfully!!")
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            
            return redirect(f'/verify/{uidb64}')
        else :
            messages.error(request, 'An errored occured during registration')

    context = {'form' : form}
    return render(request, 'accounts/register.html', context)


def loginPage(request) :
    
    if request.user.is_authenticated :
        return redirect('dashboard')
    
    if request.method == 'POST' :
        email = request.POST.get('email').lower()
        password = request.POST.get('password')

        try : 
            user = User.objects.get(email = email)
        except :
            messages.error(request, "User does not exist")
            return render(request, 'accounts/login.html')

        user = authenticate(request, email = email, password= password)

        if user is not None :
            login(request, user)
            return redirect('dashboard')
        else :
            messages.error(request, 'Password is Incorrect!!')

    return render(request, 'accounts/login.html')


def logOut(request) :
    logout(request)
    return redirect('login')


@login_required(login_url='login')
def dashboard(request) :
    return render(request, 'accounts/dashboard.html')

def verify(request, uidb64) :
    try :
        user_id = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk = user_id)
        messages.success(request, "Account Verified Successfully!")
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        messages.error(request, "Invalid verification link!")
    
    return render(request, 'accounts/verify.html')

