
function LoadMap(){
    require(["esri/Map", "esri/views/MapView", "esri/views/SceneView"], function(Map, MapView, SceneView){
        map = new Map({
            basemap:"topo"
        })

        if(viewmode == "MapView"){
            mapView = new MapView({
                map:map,
                center:[-72, 41.83],
                zoom:8.9,
                container: document.getElementById("mapping")
            })
        }else{
            map.ground = "world-elevation";

            sceneView = new SceneView({
                map:map,
                camera:{
                    position:{
                        x:-72,
                        y:41.83,
                        z:25000
                    },
                    tilt:65
                },
                container:document.getElementById("mapping")
            })
        }  
    })
}

function InitializeMappingFunctions(){
    viewmode = "MapView";
    document.getElementById("mapscenetoggle").innerText = viewmode + " Mode";
}

function ToggleView(mode){
    if (viewmode == "MapView"){
        viewmode = "SceneView";
    }else{
        viewmode = "MapView";
    }
    
    document.getElementById("mapscenetoggle").innerText = viewmode + " Mode";
    LoadMap();
}