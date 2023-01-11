from django.urls import path

from rest_framework.authtoken.views import obtain_auth_token

from .views import RegisterView, logout_view, CurrentUserView

urlpatterns = [
    path("login/", obtain_auth_token, name="api_token_auth"),
    path("register/", RegisterView.as_view(), name="register"),
    path("user/", CurrentUserView.as_view(), name="logout"),
    path("logout/", logout_view, name="logout"),
]
