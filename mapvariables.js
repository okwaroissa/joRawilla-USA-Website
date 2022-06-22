let map;
let sceneView;
let mapView;
let viewmode;
let basemaptype;
let hasbaselayers = false;
let layerlist = [];
let toclayerlabelids = [];
let activelayertitle = "";
let highwaysubdistsym = [123, 159, 204, 0.8, 0, 0, 0, 0.7, 1];
let highwaysubdistricts = [
    "Polygon", "Highway Sub Districts", 
    "https://gis.massdot.state.ma.us/arcgis/rest/services/Boundaries/HwySubDistrictBoundaries/MapServer/0/query?outFields=*&where=1%3D1", 
    highwaysubdistsym, "massdot", "massdotboundaries", "simplesymbol"];

let highwaydistsym = [123, 159, 204, 0.8, 0, 0, 0, 0.7, 1];
let highwaydistricts = [
    "Polygon", "Highway Districts", 
    "https://gis.massdot.state.ma.us/arcgis/rest/services/Boundaries/HighwayDistricts/MapServer/0/query?outFields=*&where=1%3D1", 
    highwaydistsym, "massdot", "massdotboundaries", "simplesymbol"];

let urbanbounds2010sym = [123, 159, 204, 0.8, 0, 0, 0, 0.7, 1];
let urbanboundaries2010 = [
    "Polygon", "Urban Boundaries 2010", 
    "https://gis.massdot.state.ma.us/arcgis/rest/services/Boundaries/UrbanBoundary2010/FeatureServer/0/query?outFields=*&where=1%3D1", 
    urbanbounds2010sym, "massdot", "massdotboundaries", "simplesymbol"];

let rtaboundsym = [123, 159, 204, 0.8, 0, 0, 0, 0.7, 1];
let rtaboundaries = [
    "Polygon", "RTA Boundaries", 
    "https://gis.massdot.state.ma.us/arcgis/rest/services/Boundaries/RTAs/FeatureServer/0/query?outFields=*&where=1%3D1", 
    rtaboundsym, "massdot", "massdotboundaries", "simplesymbol"];

let mpoboundsym = [123, 159, 204, 0.8, 0, 0, 0, 0.7, 1];
let mpoboundaries = [
    "Polygon", "MPO Boundaries", 
    "https://gis.massdot.state.ma.us/arcgis/rest/services/Boundaries/MPOs/MapServer/0/query?outFields=*&where=1%3D1", 
    mpoboundsym, "massdot", "massdotboundaries", "simplesymbol"];

let massdotboundaries = [highwaydistricts, highwaysubdistricts, urbanboundaries2010, rtaboundaries, mpoboundaries];

let rtabusstopsym = [150, 70, 30, 1, 50, 50, 50, 1, 1, 4];
let rtabusstops = [
    "Point", "RTA Bus Stops", 
    "https://gis.massdot.state.ma.us/arcgis/rest/services/Multimodal/RTAs/FeatureServer/1/query?outFields=*&where=1%3D1", 
    rtabusstopsym, "massdot", "massdothighwayassets", "simplesymbol"];

let massdothighwayassets = [rtabusstops]