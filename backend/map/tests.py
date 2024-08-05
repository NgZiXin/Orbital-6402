from django.test import TestCase
from rest_framework import status
from accounts.tests import BaseTestCase

class MapTest(BaseTestCase):
    def test_map_view_with_auth(self):

        # Make a GET request to the view that requires authentication
        response = self.client.get("/map/", HTTP_AUTHORIZATION=f'Token {self.token}')

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify that the HTML contains the expected content
        self.assertContains(response, '<div id="map"></div>')
    
    def test_get_path(self):
        # Define query parameters
        query_params = {
            'start': '1.3111729,103.7865181',
            'end': '1.3163744,103.775558',
        }

        # Make a GET request to the view with query parameters
        response = self.client.get('/map/get_path', data=query_params, HTTP_AUTHORIZATION=f'Token {self.token}')

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Ensure the route geometry is present in response data
        response_data = response.json()
        self.assertIn('route_geometry', response_data)
        self.assertIn('total_distance', response_data)

