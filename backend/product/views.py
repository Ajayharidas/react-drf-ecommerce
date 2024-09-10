from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from oauth2_provider.contrib.rest_framework import OAuth2Authentication
from product.models import Product
from product.serializers import ProductSerializer
from product.pagination import ProductPagination


class ProductListAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    pagination_class = ProductPagination

    def get_queryset(self):
        pk = self.kwargs.get("pk", "")
        type = self.kwargs.get("type", "")
        if not (pk and type):
            return Product.productobjects.none()
        if type == "category":
            queryset = Product.productobjects.filter(category__id=pk).distinct()
        elif type == "brand":
            queryset = Product.productobjects.filter(brand__id=pk).distinct()
        else:
            queryset = Product.productobjects.none()
        return queryset
