from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class BaseTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.client = APIClient()
        cls._create_user()

    @classmethod
    def _create_user(cls):
        # Define the payload for signup
        payload = {
            "username": "Eagle",
            "password": "12345678@",
            "height": 1.8,
            "weight": 85,
            "birthday": "2005-01-23",
            "gender": "M"
        }

        # Make a POST request to create the user account
        response = cls.client.post('/accounts/', data=payload, format='json')

        # Check if the response status code is 201 CREATED
        assert response.status_code == status.HTTP_201_CREATED

        # Parse the response JSON to get the token
        response_data = response.json()
        token = response_data.get('token')
        assert token != None

        # Save token to be used in other test methods
        cls.token = token

class AccountsTest(BaseTestCase):
    def test_signup_username_already_exists(self):
        # Define the payload for signup with an existing username
        payload = {
            "username": "Eagle",
            "password": "anotherpassword@",
            "height": 1.8,
            "weight": 75,
            "birthday": "2005-01-23",
            "gender": "M"
        }

        # Make a POST request to create a user account with an existing username
        response = self.client.post('/accounts/', data=payload, format='json')

        # Check if the response status code is 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Parse the response JSON to get the error messages
        response_data = response.json()
        error_message = response_data.get('username')

        # Ensure the error message indicates that the username already exists
        self.assertEqual(error_message, ["A user with that username already exists."])

    def test_signup_with_invalid_details(self):
        # Define the payload for signup with an existing username
        payload = {
            "username": "Falcon",
            "password": "12345678@",
            "height": "string",
            "weight": 85,
            "birthday": "2005-01-23",
            "gender": "M"
        }

        # Make a POST request to create a user account with an existing username
        response = self.client.post('/accounts/', data=payload, format='json')

        # Check if the response status code is 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Parse the response JSON to get the error messages
        response_data = response.json()
        error_message = response_data.get('height')

        # Ensure the error message indicates that the username already exists
        self.assertEqual(error_message, ["A valid number is required."])

    # /detail/

    def test_get_user_details(self):
        # Make a GET request to retrieve user details
        response = self.client.get(f'/accounts/detail/', HTTP_AUTHORIZATION=f'Token {self.token}')

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Define the expected payload
        expected_payload = {
            "id": 1,
            "username": "Eagle",
            "height": 1.8,
            "weight": 85,
            "birthday": "2005-01-23",
            "gender": "M"
        }
        
        # Parse the response JSON to get the actual payload
        actual_payload = response.json()

        # Ensure the actual payload matches the expected payload
        self.assertEqual(actual_payload, expected_payload)
    
    def test_get_user_details_no_authorization(self):
        # Make a GET request to retrieve user details
        response = self.client.get(f'/accounts/detail/')

        # Check if the response status code is 401 No Authorization
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Parse the response JSON to get the error messages
        response_data = response.json()
        error_message = response_data.get('detail')

        # Ensure the error message indicates that the username already exists
        self.assertEqual(error_message, "Authentication credentials were not provided.")

    # /ping/

    def test_ping(self):
        # Make a GET request to retrieve user details
        response = self.client.get(f'/accounts/ping/', HTTP_AUTHORIZATION=f'Token {self.token}')

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Define the expected payload
        expected_payload = {
            "message": "success",
        }

        # Parse the response JSON to get the actual payload
        actual_payload = response.json()

        # Ensure the actual payload matches the expected payload
        self.assertEqual(actual_payload, expected_payload)
    
    def test_ping_no_authorization(self):
        # Make a GET request to retrieve user details
        response = self.client.get(f'/accounts/ping/')

        # Check if the response status code is 401 No Authorization
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Parse the response JSON to get the error messages
        response_data = response.json()
        error_message = response_data.get('detail')

        # Ensure the error message indicates that the username already exists
        self.assertEqual(error_message, "Authentication credentials were not provided.")
    
    # /login/

    def test_login(self):
        # Define the payload for login
        payload = {
            "username": "Eagle",
            "password": "12345678@",
        }

        # Make a POST request to create the user account
        response = self.client.post('/accounts/login/', data=payload, format='json')

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Parse the response JSON to get the token
        response_data = response.json()
        self.token = response_data.get('token')

        # Ensure the token is present
        self.assertIsNotNone(self.token)
    
    def test_login_wrong_credentials(self):
        # Define the payload for login
        payload = {
            "username": "Eagle",
            "password": "WrongPassword@",
        }

        # Make a POST request to create the user account
        response = self.client.post('/accounts/login/', data=payload, format='json')

        # Check if the response status code is 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Parse the response JSON to get the error messages
        response_data = response.json()
        error_message = response_data.get('non_field_errors')

        # Ensure the error message indicates that the username already exists
        self.assertEqual(error_message, ["Unable to log in with provided credentials."])
    
    # Helper function for other integration test
    def create_dummy_token(self):
         # Define the payload for signup
        payload = {
            "username": "DummyUser",
            "password": "12345678@",
            "height": 1.8,
            "weight": 85,
            "birthday": "2005-01-23",
            "gender": "M"
        }

        # Make a POST request to create the user account
        response = self.client.post('/accounts/', data=payload, format='json')

        # Check if the response status code is 201 CREATED
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Parse the response JSON to get the token
        response_data = response.json()
        token = response_data.get('token')

        # Check token is not None
        self.assertIsNotNone(token)

        return token




