"""
API URLs for Valorant HUB
"""
from django.urls import path
from . import views

urlpatterns = [
    path('chat/', views.chat_view, name='chat'),
    path('models/', views.models_view, name='models'),
    path('health/', views.health_check, name='health'),
]
