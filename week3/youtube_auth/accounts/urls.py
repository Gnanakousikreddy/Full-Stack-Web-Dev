from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.loginPage, name = 'home'),
    path('register/', views.register, name =  'register'),
    path('login/', views.loginPage, name = 'login'),
    path('logout/', views.logOut, name = 'logout'),
    path('dashboard/', views.dashboard, name = "dashboard"),
    path('verify/<uidb64>/', views.verify, name = 'verify'),
]
