from rest_framework import serializers

from product.models import Product, ProductImages, ProductSize, Size


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = "__all__"


class ProductSizeSerializer(serializers.ModelSerializer):
    size = SizeSerializer(many=False)

    class Meta:
        model = ProductSize
        fields = ("id", "size", "stock")


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImages
        fields = ("id", "image")


class ProductSerializer(serializers.ModelSerializer):
    productimage = ProductImageSerializer(many=True, read_only=True)
    productsize = ProductSizeSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "description",
            "price",
            "slug",
            "brand",
            "productimage",
            "productsize",
        )
