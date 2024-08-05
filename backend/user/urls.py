from django.urls import path
from rest_framework import routers
from user.views import (
    HomeAPIView,
    UserRegistrationAPIView,
    VerifyTokenView,
    CustomTokenView,
    CustomRevokeTokenView,
    GoogleExchangeCodeView,
)


urlpatterns = [
    path("home", HomeAPIView, name="home"),
    path("api/register/", UserRegistrationAPIView.as_view(), name="register"),
    path("api/custom-token/", CustomTokenView.as_view(), name="custom-token"),
    path("api/verify-token/", VerifyTokenView.as_view(), name="verify-token"),
    path("api/revoke-token/", CustomRevokeTokenView.as_view(), name="revoke-token"),
    path("api/exchange-code/", GoogleExchangeCodeView.as_view(), name="exchange-code"),
]
