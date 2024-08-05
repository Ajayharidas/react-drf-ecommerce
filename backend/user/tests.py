import json
from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from user.models import CustomUser


class UserRegistrationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            "first_name": "testuser_fname",
            "last_name": "testuser_lname",
            "username": "testuser",
            "email": "testuser@gmail.com",
            "password": "testpassword",
            "confirm_password": "testpassword",
        }

    def test_user_registration(self):
        response = self.client.post(reverse("register"), self.user_data,format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = CustomUser.objects.get(username=self.user_data["username"])
        self.assertEqual(user.email, self.user_data["email"])
        self.assertEqual(user.first_name, self.user_data["first_name"])
        self.assertEqual(user.last_name, self.user_data["last_name"])

    def test_password_mismatch(self):
        self.user_data["confirm_password"] = "wrongpassword"
        response = self.client.post(reverse("register"), self.user_data,format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        with self.assertRaises(CustomUser.DoesNotExist):
            CustomUser.objects.get(username=self.user_data["username"])

    def test_missing_fields(self):
        incomplete_data = {
            "username": "testuser",
            "email": "testuser@gmail.com",
        }

        response = self.client.post(reverse("register"), incomplete_data,format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        with self.assertRaises(CustomUser.DoesNotExist):
            CustomUser.objects.get(username=incomplete_data["username"])

    def test_username_already_exists(self):
        CustomUser.objects.create_user(
            username=self.user_data["username"],
            email="testuser1@gmail.com",
            password="testpassword1",
        )
        response = self.client.post(reverse("register"), self.user_data,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)

    def test_email_already_exists(self):
        CustomUser.objects.create_user(
            username="testuser1",
            email=self.user_data["email"],
            password="testpassword1",
        )
        response = self.client.post(reverse("register"), self.user_data,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_invalid_email_format(self):
        self.user_data["email"] = "invalid-email"
        response = self.client.post(reverse("register"), self.user_data,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_required_fields(self):
        required_fields = ["username", "email", "password", "confirm_password"]
        for field in required_fields:
            data = self.user_data.copy()
            data.pop(field)
            response = self.client.post(reverse("register"), data,format='json')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn(field, response.data)

    def test_successful_registration_without_optional_fields(self):
        optional_list = [
            {
                "first_name": "testuser_fname",
                "username": "testuser",
                "email": "testuser@gmail.com",
                "password": "testpassword",
                "confirm_password": "testpassword",
            },
            {
                "last_name": "testuser_lname",
                "username": "testuser1",
                "email": "testuser1@gmail.com",
                "password": "testpassword1",
                "confirm_password": "testpassword1",
            },
            {
                "username": "testuser2",
                "email": "testuser2@gmail.com",
                "password": "testpassword2",
                "confirm_password": "testpassword2",
            },
        ]
        for data in optional_list:
            response = self.client.post(reverse("register"), data,format='json')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

            # Check if the user was created in the database
            user = CustomUser.objects.get(username=data["username"])
            self.assertEqual(user.email, data["email"])

    def test_password_too_short(self):
        self.user_data["password"] = "short"
        response = self.client.post(reverse("register"), self.user_data,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)


# class UserLoginTestCase(TestCase):
#     def setUp(self):
#         self.client = APIClient()
#         self.model = CustomUser
#         self.user_data = {"username": "testuser", "password": "testpassword"}

#         # Create a user
#         self.model.objects.create_user(
#             username="testuser", email="testuser@gmail.com", password="testpassword"
#         )

#     def test_user_login(self):
#         # Attempt to login with valid credentials
#         response = self.client.post(reverse("login"), self.user_data)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertIn("username", response.data)
#         self.assertIn("email", response.data)
#         self.assertEqual(response.data["username"], self.user_data["username"])

#         # Attempt to login with invalid credentials
#         self.user_data["password"] = "wrongpassword"
#         response = self.client.post(reverse("login"), self.user_data)
#         self.assertIn("non_field_errors", response.data)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserAuthenticationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.model = CustomUser
        self.user_data = {
            'grant_type':'password',
            'username':'testuser_uname',
            'password':'testpassword',
        }


    def test_user_authentication(self):
        self.model.objects.create_user(username=self.user_data['username'],email='testuser@gmail.com',password=self.user_data['password'])

        response = self.client.post(reverse('custom-token'), data=self.user_data,headers={'Content-Type':'application/json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn('access_token', response.data)
        self.assertIn('refresh_token', response.data)
        
        access_token = response.data['access_token']
        response = self.client.post(reverse('verify-token'), {}, HTTP_AUTHORIZATION=f'Bearer {access_token}')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
