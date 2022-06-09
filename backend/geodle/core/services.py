import math
from shapely.geometry import shape, Point
import shapefile
import re
import random
import urllib.request

from geodle.settings import HERE_API_KEY

def getRandomCoordsInLocation(locationName):
    """
    Returns a random coordinate in a given location.
    """
    shapes = shapefile.Reader('shapefiles/World_Countries_v3.shp')
    locationFeatures = [s for s in shapes.records() if locationName in s][0]
    features_id = int(re.findall(r'\d+',str(locationFeatures))[0])

    shapeRecs = shapes.shapeRecords()
    feature = shapeRecs[features_id].shape.__geo_interface__

    shp_geom = shape(feature)

    minx, miny, maxx, maxy = shp_geom.bounds
    while True:
        p = Point(random.uniform(minx,maxx), random.uniform(miny,maxy))
        if shp_geom.contains(p):
            return p.y, p.x
    
def getSatImage(lat, long, level=16, show_labels=False):
    """
    Returns a satellite image for a given location using the HERE API
    """

    # Calculate the mercator projection values for the given lat and long
    # TODO: Calculate and store this with gameround to save compute time?
    latRad = lat * (math.pi / 180)
    n = math.pow(2, level)
    xTile = int((long + 180) / 360 * n)
    yTile = int((1 - math.log(math.tan(latRad) + (1 / math.cos(latRad))) / math.pi) / 2 * n)

    url = "https://1.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/{}.day/{}/{}/{}/512/jpg?apiKey={}".format(
        'hybrid' if show_labels else 'satellite', level, xTile, yTile, HERE_API_KEY)

    req = urllib.request.Request(url)
    response = urllib.request.urlopen(req)
    return response.read()

