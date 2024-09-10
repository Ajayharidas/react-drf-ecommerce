from django.conf import settings
from django.middleware.csrf import get_token
from rest_framework.request import Request
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from brand.documents import BrandDocument
from category.documents import CategoryDocument
from user.serializers import (
    SearchSerializer,
    UserRegistrationSerializer,
    UserSerializer,
    RevokeTokenSerializer,
    ExchangeCodeSerializer,
    HomeSerializer,
)
from oauth2_provider.models import AccessToken, RefreshToken, Application
from django.utils.translation import gettext_lazy as _
import logging
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from oauth2_provider.contrib.rest_framework import OAuth2Authentication
from drf_social_oauth2.views import TokenView, ConvertTokenView
from user.decorators import modify_token_view_decorator
from user.services import google_get_tokens
from category.models import Category
from elasticsearch_dsl.query import MultiMatch

logger = logging.getLogger(__name__)

base_url = settings.BASE_URL


@api_view(["GET"])
@permission_classes([AllowAny])
def HomeAPIView(request):
    parent_categories = Category.objects.filter(parent__isnull=True)
    child_categories = Category.objects.filter(parent__isnull=False)
    serializer = HomeSerializer(
        {"parent_categories": parent_categories, "child_categories": child_categories}
    )
    return Response(data=serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def CSRFTokenAPIView(request):
    csrf_token = get_token(request)
    return Response({"csrf_token": csrf_token})


class UserRegistrationAPIView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        response_data = UserSerializer(user).data
        return Response(response_data, status=status.HTTP_201_CREATED)


class GoogleExchangeCodeView(APIView):
    def post(self, request: Request, *args, **kwargs):
        data = request.data.copy()
        data["client_id"] = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
        data["client_secret"] = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET
        serializer = ExchangeCodeSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serialized_data = serializer.validated_data
        response = google_get_tokens(data=serialized_data)
        return Response(data=response.json(), status=response.status_code)


class CustomConvertTokenView(ConvertTokenView):
    def post(self, request: Request, *args, **kwargs):
        request.data["client_id"] = settings.CLIENT_ID
        return super().post(request, *args, **kwargs)


@method_decorator(modify_token_view_decorator, name="dispatch")
class CustomTokenView(TokenView):
    pass


@method_decorator(csrf_exempt, name="dispatch")
class VerifyTokenView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = (OAuth2Authentication,)

    def get(self, request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return Response(
                {"error": _("No token provided")}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = auth_header.split(" ")[1]
            access_token = (
                AccessToken.objects.select_related("user").filter(token=token).first()
            )

            if access_token:
                if not access_token.is_expired() and access_token.is_valid():
                    user_serializer = UserSerializer(access_token.user)
                    return Response(
                        {"user": user_serializer.data}, status=status.HTTP_200_OK
                    )
                else:
                    return Response(
                        {"error": "Access token expired or invalid"},
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
            else:
                return Response(
                    {"error": _("Invalid token")}, status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            print(f"Exception occurred: {e}")
            return Response(
                {"error": _("Error validating token")},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CustomRevokeTokenView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request: Request, *args, **kwargs):
        data = request.data.copy()
        data["client_id"] = settings.CLIENT_ID
        data["client_secret"] = settings.CLIENT_SECRET
        serializer = RevokeTokenSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        client_id = serializer.validated_data["client_id"]
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        access_token = auth_header.replace("Bearer ", "", 1)
        try:
            app = Application.objects.get(client_id=client_id)
            access_token = AccessToken.objects.get(
                user=request.user, token=access_token, application=app
            )
            RefreshToken.objects.get(
                user=request.user, application=app, access_token=access_token
            ).revoke()
        except Application.DoesNotExist:
            return Response(
                {"error": "Application could not be found."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except AccessToken.DoesNotExist:
            return Response(
                {"error": "Access token could not be found."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except RefreshToken.DoesNotExist:
            return Response(
                {"error": "Refresh token could not be found."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"status": "Token revoked successfully."}, status=status.HTTP_204_NO_CONTENT
        )


class SearchProductView(APIView):
    serializer = SearchSerializer
    brand_document = BrandDocument
    category_document = CategoryDocument

    def get(self, request, *args, **kwargs):
        query = request.GET.get("query", "")
        if not query:
            return Response(
                {"message": "Query not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            query = MultiMatch(query=query, fields=["name"])
            brand_response = self.brand_document.search().query(query).execute()
            category_response = self.category_document.search().query(query).execute()

            combined_results = []

            for item in brand_response:
                combined_results.append(
                    {
                        "id": item.id,
                        "name": item.name,
                        "slug": item.slug,
                        "type": "brand",
                    }
                )

            for item in category_response:
                combined_results.append(
                    {
                        "id": item.id,
                        "name": item.name,
                        "slug": item.slug,
                        "type": "category",
                    }
                )
            serialized_data = self.serializer(combined_results, many=True).data
            return Response(serialized_data)
        except Exception as e:
            return Response(
                {"message": f"Error connecting to Elasticsearch: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
