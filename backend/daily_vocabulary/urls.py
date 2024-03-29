from django.urls import path
from daily_vocabulary import views

urlpatterns = [
    path('users/', views.user_list, name='users'),
    path('users/me/', views.current_user),
    path('words/', views.words_list),
    path('words/<int:pk>/', views.word_detail),
    path('words/update/', views.update_word_scores),
    path('words/daily/', views.daily_words_list),
    path('activate/<uidb64>/<token>/', views.validate_user, name='activate'),
    path('reset-password', views.reset_password),
    path('set-password/<uidb64>/<token>/', views.set_password),
]
