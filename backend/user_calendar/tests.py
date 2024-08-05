# Create your tests here.
from rest_framework import status
from rest_framework.test import APIClient
from accounts.tests import BaseTestCase, AccountsTest

class CalendarTest(BaseTestCase):
    def setUp(self):
        self.client = APIClient()
        self.__create_post()

    def __create_post(self):
        # Define the payload
        payload = {
            "date": "2024-08-01",
            "start_time": "0800",
            "end_time": "1000",
            "header": "Upper Body Workout",
            "body": "10 x push ups"
        }

        # Make a POST request to create the calendar
        response = self.client.post('/calendar/', data=payload, format='json', HTTP_AUTHORIZATION=f'Token {self.token}')

        # Check if the response status code is 201 CREATED
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test__integration(self):
        # Test GET List
        self.__get_user_calendar_list()

        # Test CRUD for individual entries

        # Test GET 
        self.__get_individual_entry()

        # Test PUT
        self.__edit_individual_entry()

        # Test DEL from unauthorized user (i.e. non-owner)
        self.__del_by_unauthorized()

        # Test DEL
        self.__del_individual_entry()

    def __get_user_calendar_list(self):
        # Make a GET request to retrieve user calendar
        response = self.client.get('/calendar/', HTTP_AUTHORIZATION=f'Token {self.token}')

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Parse the response JSON to get the actual payload
        actual_payload = response.json()

        # Ensure payload is a list of at least length 1
        self.assertIsInstance(actual_payload, list)  # Ensure it's a list
        self.assertGreaterEqual(len(actual_payload), 1)

    # /{id}/

    def __get_individual_entry(self):
        # Make a GET request to retrieve user calendar
        response = self.client.get('/calendar/1/', HTTP_AUTHORIZATION=f'Token {self.token}')

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Define the expected payload
        expected_payload = {
            "id": 1,
            "date": "2024-08-01",
            "start_time": "0800",
            "end_time": "1000",
            "header": "Upper Body Workout",
            "body": "10 x push ups"
        }
        
        # Parse the response JSON to get the actual payload
        actual_payload = response.json()

        # Ensure the actual payload matches the expected payload
        self.assertEqual(actual_payload, expected_payload)
    
    def __edit_individual_entry(self):

        # Define the updated payload
        updated_payload = {
            "date": "2024-08-01",
            "start_time": "0800",
            "end_time": "1000",
            "header": "Upper Body Workout - Updated",
            "body": "15 x push ups"
        }

        # Make a PUT request to update the calendar entry
        response = self.client.put(
            '/calendar/1/', 
            data=updated_payload, 
            format='json', 
            HTTP_AUTHORIZATION=f'Token {self.token}'
        )

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Define the expected payload
        expected_payload = {
            "id": 1,
            "date": "2024-08-01",
            "start_time": "0800",
            "end_time": "1000",
            "header": "Upper Body Workout - Updated",
            "body": "15 x push ups"
        }
        
        # Parse the response JSON to get the actual payload
        actual_payload = response.json()

        # Ensure the actual payload matches the expected payload
        self.assertEqual(actual_payload, expected_payload)
    
    def __del_by_unauthorized(self):
        # Create dummy user
        dummy_token = AccountsTest().create_dummy_token()

        # Make a PUT request to update the calendar entry
        response = self.client.delete('/calendar/1/',HTTP_AUTHORIZATION=f'Token {dummy_token}')

        # Check if the response status code is 404 NOT FOUND
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def __del_individual_entry(self):

        # Make a PUT request to update the calendar entry
        response = self.client.delete('/calendar/1/',HTTP_AUTHORIZATION=f'Token {self.token}')

        # Check if the response status code is 204 NO CONTENT
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
