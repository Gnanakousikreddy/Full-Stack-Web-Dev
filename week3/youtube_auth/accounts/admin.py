from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


class UserAdmin(BaseUserAdmin):
    ordering = ['email']  

    list_display = ['email', 'username', 'is_staff', 'is_active'] 

    search_fields = ['email', 'username']  

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('username', 'avatar')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'avatar', 'password1', 'password2', 'is_active', 'is_staff')}
        ),
    )

    # Use your custom User model’s `USERNAME_FIELD`
    def get_fieldsets(self, request, obj=None):
        return super().get_fieldsets(request, obj)



admin.site.register(User, UserAdmin)
