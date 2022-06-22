
function LoadMap(){
    require(["esri/Map", "esri/views/MapView", "esri/views/SceneView", "esri/geometry/SpatialReference"], 
    function(Map, MapView, SceneView, SpatialReference){
        map = new Map({
            basemap:basemaptype,
            layers:layerlist
        })

        if(viewmode == "MapView"){
            mapView = new MapView({
                map:map,
                center:[-72, 42],
                zoom:8.9,
                container: document.getElementById("mapping"),
                spatialReference:SpatialReference.WebMercator
            })
        }else{
            map.ground = "world-elevation";
            sceneView = new SceneView({
                map:map,
                camera:{
                    position:{
                        x:-72,
                        y:42,
                        z:7500
                    },
                    tilt:45
                },
                spatialReference:SpatialReference.WebMercator,
                container:document.getElementById("mapping")
            })
        }  
    })
}

function InitializeMappingFunctions(){
    viewmode = "MapView";
    basemaptype = "topo";
    const baseselector = document.getElementById("basemap-selector");
    baseselector.addEventListener("change", function(){
        basemaptype = baseselector.value;
        switch (basemaptype){
            case "topo":
                map.basemap = "topo";
                break; 
            case "satellite":
                map.basemap = "satellite";
                break;
            case "hybrid":
                map.basemap = "hybrid";
                break;
            case "openstreet":
                map.basemap = "osm";
                break;
        }     
    })   
}

function ToMapView(){
    if (viewmode == "SceneView"){
        viewmode = "MapView"
    }
    LoadMap();
}

function ToSceneView(){
    if (viewmode == "MapView"){
        viewmode = "SceneView"
    }
    LoadMap();
}

function CreateSimpleFeatureLayers(layergroup){
    let grouplength = layergroup.length;
    require(["esri/layers/FeatureLayer", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer",
    "esri/geometry/SpatialReference"], function(Layer, Marker, Fill, Render, SpatialReference){
        for(let i = 0; i < grouplength; i++){
            let layerdata = layergroup[i];
            let layersym = layerdata[3];

            let render = new Render();
            if(layerdata[0] == "Polygon"){
                render.symbol = new Fill({
                    color:[layersym[0], layersym[1], layersym[2], layersym[3]],
                    outline:{
                        color:[layersym[4], layersym[5], layersym[6], layersym[7]],
                        width:layersym[8]
                     }
                })   
            }

            if(layerdata[0] == "Point"){
                render.symbol = new Marker({
                    color:[layersym[0], layersym[1], layersym[2], layersym[3]],
                    outline:{
                        color:[layersym[4], layersym[5], layersym[6], layersym[7]],
                        width:layersym[8]
                    },
                    size:layersym[9]
                })
            }

            let layer = new Layer({
                url:layerdata[2],
                renderer: render,
                title:layerdata[1],
                outFields:["*"],
                spatialReference:SpatialReference.WebMercator
            })
            layerlist.push(layer);
        }
    })
}

function CreateTOC(category){
    let legcont = "";
    document.getElementById("toc-legend").innerHTML = "";
    if(category == "Overview"){
        legcont += `<ul id="legcont">
                        <li>
                            <span class="caret">MassDOT GIS Layers</span>
                            <ul class="nested">
                                <li>
                                    <span class="caret">Highway Assets</span>
                                    <ul id="massdothighwayassets" class="nested"></ul>
                                </li> 
                                <li>
                                    <span class="caret">Boundaries</span>
                                    <ul id="massdotboundaries" class="nested"></ul>
                                </li> 
                            </ul>
                        </li>

                        <li>
                            <span class="caret">MassGIS Layers</span>
                            <ul class="nested">
                                <li>
                                    <span class="caret">MA State GIS Portal Layers</span>
                                    <ul id="massgisnode" class="nested"></ul>
                                </li>
                            </ul>
                        </li>
                        
                    </ul>`
    }
    document.getElementById("toc-legend").innerHTML = legcont; 
}

function PopulateTOC(layerscol){
    let targetnode = "";
    for (let i = 0; i < layerscol.length; i++){
        let source = layerscol[i][4];
        let category = layerscol[i][5];

        if (source == "massdot" && category == "massdotboundaries"){
            targetnode = "massdotboundaries"
        };
        if (source == "massdot" && category == "massdothighwayassets"){
            targetnode = "massdothighwayassets"
        };

        let legnode = document.getElementById(targetnode);
        let layercheck = document.createElement("input");
        layercheck.type = "checkbox";
        layercheck.value = Number(i);
        layercheck.checked = true;

        let layerlabel = document.createElement("label");
        let baselabel = "toclabel"
        layerlabel.setAttribute("id", baselabel.concat(i));
        layerlabel.classList.add("toc-layer-label");
        layerlabel.textContent = layerscol[i][1];

        toclayerlabelids.push(baselabel.concat(i)); //Add layer label id to collection

        layerlabel.addEventListener("click", function(){
            for (let j = 0; j < toclayerlabelids.length; j++){
                let lblid = toclayerlabelids[j];
                document.getElementById(lblid).style.color = RGBA_Hex(0, 0, 0, 1);
                document.getElementById(lblid).style.fontWeight = "normal";   
            }
            this.style.color = RGBA_Hex(218,165,32,1);
            this.style.fontWeight = "bold"
            activelayertitle = this.textContent;
            alert(activelayertitle);
        })

        let layeritem = document.createElement("li");
        let layerdiv = document.createElement("div");
        layerdiv.appendChild(layercheck);
        layerdiv.appendChild(layerlabel);
        layeritem.appendChild(layerdiv);

        if(legnode != null){
            legnode.appendChild(layeritem)
        };

        layercheck.addEventListener("click", function(e){
            let thislayer = null;
            if(hasbaselayers == false){
                thislayer = map.allLayers.find(function(layer){
                    return layer.title === layerlabel.textContent;
                })
            }else{
                thislayer = map.basemap.baseLayers.find(function(layer){
                    return layer.title === layerlabel.textContent;
                })
            }

            if(thislayer != null){
                thislayer.visible = e.target.checked
            }
        })

        if(layerscol[i][6] === "simplesymbol"){
            let brk = document.createElement("br");
            let cnvs = document.createElement("canvas");
            let basename = "canvas";
            let canvid = basename.concat(i);
            cnvs.setAttribute("id", canvid);
            layerdiv.appendChild(brk);
            layerdiv.appendChild(cnvs);
            LayerSym(canvid, layerscol[i]);
        }
    }
}

function LayerSym(canvasid, lyrdata) {
    let canvo = document.getElementById(canvasid);
    canvo.width = 36;
    canvo.height = 16;
    let symprops = lyrdata[3];
    if (canvo.getContext) {
        let ctx = canvo.getContext("2d");

        if (lyrdata[0] === "Polygon") {
            ctx.fillStyle = RGBA_Hex(symprops[0], symprops[1], symprops[2], symprops[3]);
            ctx.fillRect(2, 2, 32, 12);
            ctx.lineWidth = 2;
            ctx.strokeStyle = RGBA_Hex(symprops[4], symprops[5], symprops[6], symprops[7]);;
            ctx.strokeRect(2, 2, 32, 12);
        }
        if (lyrdata[0] === "Point") {
            ctx.fillStyle = RGBA_Hex(symprops[0], symprops[1], symprops[2], symprops[3]);
            ctx.beginPath();
            ctx.arc(18, 8, 5, 0, 2 * Math.PI);
            ctx.strokeStyle = RGBA_Hex(symprops[4], symprops[5], symprops[6], symprops[7]);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
            ctx.fill();
        }
        if (lyrdata[0] === "Polyline") {
            ctx.strokeStyle = RGBA_Hex(symprops[0], symprops[1], symprops[2], symprops[3]);
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.moveTo(2, 8);
            ctx.lineTo(34, 8);
            ctx.stroke();
        }
    }
}

function RGBA_Hex(r, g, b, a) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    a = Math.round(a * 255).toString(16);

    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;
    if (a.length == 1)
        a = "0" + a;
    return "#" + r + g + b + a;
}

function AnimateTOC(){
    toccarets = document.getElementsByClassName("caret");
    for(let i = 0; i < toccarets.length; i++){
        toccarets[i].addEventListener('click', function(){
            li = this.parentElement;
            li.querySelector('.nested').classList.toggle("active");
            this.classList.toggle("caret-down");
        })
    }
}

function GoTo(){
    if(viewmode === "MapView"){
        mapView.goTo({
            center:[-72, 42],
            zoom:8.9
        })
    }
    if(viewmode === "SceneView"){

    }
}