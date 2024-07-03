# scheduling_app/urls.py

from django.urls import path
from .views import register_account, login, logout

urlpatterns = [
    path('register_account/', register_account, name='register_account'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
]
