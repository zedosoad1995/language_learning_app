from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import User


class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'timezone',
                  'num_daily_words', 'is_staff', 'is_superuser', 'is_active', 'is_email_verified')


class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'timezone',
                  'num_daily_words', 'is_staff', 'is_superuser', 'is_active', 'is_email_verified')
