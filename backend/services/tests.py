from django.test import TestCase
from rest_framework import status

class ServiceTest(TestCase):

    def test_find_nearest_gym(self):
        # Define query parameters
        query_params = {
            'type': 'gym',
            'address': '380105',
            'radius': '3.5'
        }

        # Make a GET request to the view with query parameters
        response = self.client.get('/services/', data=query_params)

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify that the HTML contains the expected content
        self.assertContains(response, '<div id="map"></div>')
    
    def test_no_nearest_gym(self):
        # Define query parameters
        query_params = {
            'type': 'gym',
            'address': '380105',
            'radius': '0.1'
        }

        # Make a GET request to the view with query parameters
        response = self.client.get('/services/', data=query_params)

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify that the HTML contains the expected content
        self.assertContains(response, '<p>No nearby gyms found.</p>')
        self.assertContains(response, '<p>Please refine your search.</p>')

    def test_invalid_postal_code(self):
        # Define query parameters
        query_params = {
            'type': 'gym',
            'address': '3801050000',
            'radius': '3.5'
        }

        # Make a GET request to the view with query parameters
        response = self.client.get('/services/', data=query_params)

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify that the HTML contains the expected content
        self.assertContains(response, '<p>Invalid Search.</p>')
        self.assertContains(response, '<p>Please refine your search.</p>')
