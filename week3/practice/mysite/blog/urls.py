from django.urls import path
from . import views


urlpatterns = [
    path('register/', views.regPage, name = "register"),
    path('logout/', views.logOut, name = "logout"),
    path('login/', views.loginPage, name = "login"),

    path('', views.home, name = "home"),
    path('room/<str:pk>', views.room, name = "room"),
    path('profile/<str:pk>', views.userProfile, name = "profile"),
    path('create-room/', views.createRoom, name = 'create-room'),
    path('update-room/<str:pk>', views.updateRoom, name = 'update-room'),
    path('delete-room/<str:pk>', views.deleteRoom, name = 'delete-room'),
    path('delete-message/<str:pk>', views.deleteMsg, name = 'delete-message'),
    
    path('update-user/', views.updateUser, name = "update-user"),
    path('topics/', views.topicsPage, name = "topics"),
    path('activity/', views.activityPage, name = "activity"),
]

