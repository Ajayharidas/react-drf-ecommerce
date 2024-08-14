from django.urls import path
from rest_framework import routers
from user.views import (
    HomeAPIView,
    CSRFTokenAPIView,
    SearchProductView,
    UserRegistrationAPIView,
    VerifyTokenView,
    CustomTokenView,
    CustomRevokeTokenView,
    GoogleExchangeCodeView,
    CustomConvertTokenView,
)


urlpatterns = [
    path("api/home/", HomeAPIView, name="home"),
    path("api/csrf-token/", CSRFTokenAPIView, name="csrf-token"),
    path("api/register/", UserRegistrationAPIView.as_view(), name="register"),
    path("api/convert-token/", CustomConvertTokenView.as_view(), name="convert-token"),
    path("api/custom-token/", CustomTokenView.as_view(), name="custom-token"),
    path("api/verify-token/", VerifyTokenView.as_view(), name="verify-token"),
    path("api/revoke-token/", CustomRevokeTokenView.as_view(), name="revoke-token"),
    path("api/exchange-code/", GoogleExchangeCodeView.as_view(), name="exchange-code"),
    path(
        "api/search/", SearchProductView.as_view(), name="search"
    ),
]
