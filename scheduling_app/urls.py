from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, CustomFieldViewSet, CustomUserViewSet, UserTypeViewSet, register_account, login, logout, user_profile_fields, get_user_name, get_csrf_token

router = DefaultRouter()
router.register(r'accounts', AccountViewSet, basename='account')
router.register(r'custom-fields', CustomFieldViewSet, basename='customfield')
router.register(r'users', CustomUserViewSet, basename='customuser')
router.register(r'user_types', UserTypeViewSet, basename='usertype')

api_patterns = [
    path('register_account/', register_account, name='register_account'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('user_profile_fields/', user_profile_fields, name='user_profile_fields'),
    path('get_user_name/', get_user_name, name='get_user_name'),
    path('get_csrf_token/', get_csrf_token, name='get_csrf_token'),
    path('', include(router.urls)),
]

urlpatterns = [
    path('api/', include(api_patterns)),
]
