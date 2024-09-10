from django.urls import path
from product.views import ProductListAPIView

urlpatterns = [
    path("<str:type>/<int:pk>/", ProductListAPIView.as_view(), name="products")
]
