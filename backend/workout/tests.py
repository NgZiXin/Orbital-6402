# Create your tests here.
from rest_framework import status
from accounts.tests import BaseTestCase

class WorkoutTest(BaseTestCase):

    def test_get_weight_training(self):
        # Define query parameters
        query_params = {
            'fitnessLevel': '3',
            'numExercises': '3',
            'mainMuscleGroups': 'Leg',
            'subMuscleGroups': '',
            'healthCond': '',
            'otherRemarks': ''
        }

        # Make a GET request to the view with query parameters
        response = self.client.get('/workout/get_weight_training/', data=query_params, HTTP_AUTHORIZATION=f'Token {self.token}')

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Reponse is non-deterministic
    
    def test_get_run_training(self):
        # Define query parameters
        query_params = {
            'distance': '10',
            'duration': '1 hour 0 minutes 0 seconds',
            'weeks': '4',
            'healthCond': '',
            'otherRemarks': ''
        }

        # Make a GET request to the view with query parameters
        response = self.client.get('/workout/get_run_training/', data=query_params, HTTP_AUTHORIZATION=f'Token {self.token}')

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Reponse is non-deterministic
