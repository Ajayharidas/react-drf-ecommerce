from django.urls import path
from product.views import ProductAPIView

urlpatterns = [path("products/", ProductAPIView, name="products")]
