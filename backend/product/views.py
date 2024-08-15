from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes,authentication_classes
from rest_framework.permissions import IsAuthenticated
from oauth2_provider.contrib.rest_framework import OAuth2Authentication

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def ProductAPIView(request):
    return Response({"message":"Valid access_token"},status=status.HTTP_202_ACCEPTED)

