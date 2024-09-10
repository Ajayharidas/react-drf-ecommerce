from os import name
from django.conf import settings
from requests import delete
from rest_framework import serializers, status
from rest_framework.response import Response
from brand.serializers import BrandSerializer
from product.models import Product
from user.models import CustomUser
from django.contrib.auth import authenticate
from django.core.validators import MinLengthValidator
from category.serializers import CategorySerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "first_name", "last_name", "username", "email"]


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
        validators=[MinLengthValidator(8)],
    )
    confirm_password = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )

    class Meta:
        model = CustomUser
        fields = [
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
            "confirm_password",
        ]
        extra_kwargs = {
            "first_name": {"required": False},
            "last_name": {"required": False},
        }

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = CustomUser.objects.create_user(**validated_data)
        return user


class RevokeTokenSerializer(serializers.Serializer):
    client_id = serializers.CharField(max_length=200)


class ExchangeCodeSerializer(serializers.Serializer):
    grant_type = serializers.CharField(max_length=50)
    code = serializers.CharField(max_length=500)
    client_id = serializers.CharField(max_length=500)
    client_secret = serializers.CharField(max_length=500)
    redirect_uri = serializers.CharField(max_length=100)


class HomeSerializer(serializers.Serializer):
    parent_categories = CategorySerializer(many=True)
    child_categories = CategorySerializer(many=True)


class SearchSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    slug = serializers.SlugField()
    type = serializers.CharField()
