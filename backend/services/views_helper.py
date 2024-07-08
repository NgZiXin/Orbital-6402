import requests
from haversine import haversine, Unit
import overpy
import json

# Custom Class
class InvalidSearchError(Exception):
    pass

class NoNearbyParkFound(Exception):
    pass

class NoNearbyGymFound(Exception):
    pass

class Landmark():
    def __init__(self, name, latitude, longitude, distance):
        self.name = name
        self.latitude = latitude
        self.longitude = longitude
        self.distance = distance

def geoCode(address):
    """
    Helper function taking an address (ideally postal code) and return the address's 
    latitude, longitude and full address.

    Raise Exception if search query (i.e. address) is invalid.
    """
    # Geo code using oneMap API services (no limits)
    response = requests.get(
        f"https://www.onemap.gov.sg/api/common/elastic/search?searchVal={address}&returnGeom=Y&getAddrDetails=Y&pageNum=1"
    )

    # Check if the response is okay
    if response.status_code == 200:
        data = response.json()
        if data["found"] == 0:
             raise InvalidSearchError
        return data["results"][0]["LATITUDE"], data["results"][0]["LONGITUDE"], data["results"][0]["ADDRESS"]
        
    else:
        # Raise an exception with the status code and error message
        response.raise_for_status()

def find_nearest_gyms(lat, lon, radius):
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
    (around:{radius},{lat},{lon});
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
                "{:.2f}".format(haversine((float(lat),float(lon)),(float(node.lat),float(node.lon)),unit=Unit.KILOMETERS)),
            )
            gyms.append(gym)
    if len(gyms) == 0:
        raise NoNearbyGymFound
    return gyms

def find_nearest_parks(lat, lon, radius):
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
    (around:{radius},{lat},{lon});
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
                "{:.2f}".format(haversine((float(lat),float(lon)),(float(node.lat),float(node.lon)),unit=Unit.KILOMETERS)),
            )
            parks.append(park)
    if len(parks) == 0:
        raise NoNearbyParkFound
    return parks