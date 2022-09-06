from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import User, Word


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    fieldsets = [
        (None, {
            'fields': ('username', 'email', 'first_name', 'last_name', 'last_update', 'timezone',
                       'num_daily_words', 'is_staff', 'is_superuser', 'is_active', 'is_email_verified')
        })
    ]
    model = User
    list_display = ['username', 'email', 'first_name', 'last_name', 'timezone',
                    'last_update', 'num_daily_words', 'is_superuser', 'is_active', 'is_email_verified']


admin.site.register(User, CustomUserAdmin)
admin.site.register(Word)
