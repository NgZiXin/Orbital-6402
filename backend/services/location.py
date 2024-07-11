import requests
from haversine import haversine, Unit
import overpy
from .exceptions import InvalidSearchError, NoNearbyGymFound, NoNearbyParkFound 


class Location():

    # Constructor
    def __init__(self, search, radius):
        self.radius = radius

        # Geo code using oneMap API services (no limits)
        response = requests.get(
            f"https://www.onemap.gov.sg/api/common/elastic/search?searchVal={search}&returnGeom=Y&getAddrDetails=Y&pageNum=1"
        )

        # Check if the response is okay
        if response.status_code == 200:
            data = response.json()
            if data["found"] == 0:
                raise InvalidSearchError
            self.lat = data["results"][0]["LATITUDE"]
            self.lon = data["results"][0]["LONGITUDE"]
            self.address = data["results"][0]["ADDRESS"]
            
        else:
            # Raise an exception with the status code and error message
            response.raise_for_status()

    # Public Methods
    def find_nearest_gyms(self):
        """
        Function takes a latitude, longitude and radius and return a list of nearby gyms
        within the radius of the coordinates.
        """
        api = overpy.Overpass()
        
        # Query to find gyms within the specified radius
        query = f"""
        [out:json];
        node
        ["leisure"="fitness_centre"]
        (around:{self.radius},{self.lat},{self.lon});
        out body;
        """
        
        result = api.query(query)
        gyms = []
        if result.nodes:
            for node in result.nodes:
                gym = Landmark(
                    node.tags.get("name","Gym (Name NOT FOUND)"), 
                    node.lat,
                    node.lon,
                    "{:.2f}".format(haversine((float(self.lat),float(self.lon)),(float(node.lat),float(node.lon)),unit=Unit.KILOMETERS)),
                )
                gyms.append(gym)
        if len(gyms) == 0:
            raise NoNearbyGymFound
        return gyms

    def find_nearest_parks(self):
        """
        Function takes a latitude, longitude and radius and return a list of nearby parks
        within the radius of the coordinates.
        """
        
        api = overpy.Overpass()
        
        # Query to find parks within the specified radius
        query = f"""
        [out:json];
        node
        ["leisure"="park"]
        (around:{self.radius},{self.lat},{self.lon});
        out body;
        """
        result = api.query(query)
        parks = []
        if result.nodes:
            for node in result.nodes:
                park = Landmark(
                    node.tags.get("name","Park (Name NOT FOUND)"), 
                    node.lat,
                    node.lon,
                    "{:.2f}".format(haversine((float(self.lat),float(self.lon)),(float(node.lat),float(node.lon)),unit=Unit.KILOMETERS)),
                )
                parks.append(park)
        if len(parks) == 0:
            raise NoNearbyParkFound
        return parks

# Helper Class
class Landmark():

    # Constructor
    def __init__(self, name, latitude, longitude, distance):
        self.name = name
        self.latitude = latitude
        self.longitude = longitude
        self.distance = distance