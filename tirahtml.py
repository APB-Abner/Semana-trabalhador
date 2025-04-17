import googlemaps
from datetime import datetime

gmaps = googlemaps.Client(key='AIzaSyDWdvIiI913bEwygJqP4HPaaWa0ySm8JHk')

# Geocoding an address
geocode_result = gmaps.geocode('1600 Amphitheatre Parkway, Mountain View, CA')
print(geocode_result)