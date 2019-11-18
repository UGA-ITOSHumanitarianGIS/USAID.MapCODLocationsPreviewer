//dawgmap 

jQuery(document).ready(function ()
{
    //initialization                 
    var sitePath = "";
    sitePath = location.protocol + '//' + location.host;
    if (jQuery("#hiddenApplicationName").length)
    { sitePath = sitePath + "/" + jQuery("#hiddenApplicationName").val() }         

    var config = {
        async: true,
        packages: [{ name: "dawgmap", location: sitePath + "/Scripts/map" }]
    };

    var dependencies = [
		'dawgmap',
		'dawgmap/layer/DawgMapFeatureLayer',
		'dawgmap/layer/DawgMapServiceLayer',
        'dawgmap/layer/DawgMapImageServiceLayer',
        'dawgmap/snippet/TalkToApp/Snippet',
        'dojo/request',
        'dojo/json'
    ];

    require(config, dependencies, function (DawgMap, FeatureLayer, DynamicServiceLayer, ImageServiceLayer, Snippet, request, JSON)
    {
        top.dawgMap = new DawgMap(
        {
            basemap: "topo",
            zoom: 9,
            mapID: "map",
            logo: false,
            showAttribution: true,
            attributionWidth: 0.45,
            displayGraphicsOnPan: true,
            fadeOnZoom: true,
            autoResize: true,
            title: "COD MAP AND Locations Previewer Module",
            loadingMessage: "Loading..",
            useProxy: true,
            alwaysUseProxy: false,
                startExtent: {
                    xmin: 2457696.5642112,
                    ymin: -2708659.9702007985,
                    xmax: 4052478.722352,
                    ymax: -1560270.0572446154,
                    spatialReference: {
                        wkid: 102100
                    }
                },
                rules: [{
                    urlPrefix: "https://gistmaps.itos.uga.edu/arcgis/rest/services/COD_External",
                    proxyUrl: "Proxy/Index"
                },
                {
                    urlPrefix: "http://api.worldbank.org/v2/country/?format=json",
                    proxyUrl: "Proxy/Index"

                    },
                 {
                        urlPrefix: "http://api.worldbank.org/v2/country/?format=json&page=1",
                        proxyUrl: "Proxy/Index"

                    }, {
                        urlPrefix: "http://api.worldbank.org/v2/country/?format=json&page=2",
                        proxyUrl: "Proxy/Index"

                    }, {
                        urlPrefix: "http://api.worldbank.org/v2/country/?format=json&page=3",
                        proxyUrl: "Proxy/Index"

                    }, {
                        urlPrefix: "http://api.worldbank.org/v2/country/?format=json&page=4",
                        proxyUrl: "Proxy/Index"

                    }, {
                        urlPrefix: "http://api.worldbank.org/v2/country/?format=json&page=5",
                        proxyUrl: "Proxy/Index"

                    }, {
                        urlPrefix: "http://api.worldbank.org/v2/country/?format=json&page=6",
                        proxyUrl: "Proxy/Index"

                    },{
                        urlPrefix: "http://api.worldbank.org/v2/country/?format=json&page=7",
                        proxyUrl: "Proxy/Index"

                    }]
        });
               


        // Fetch tools and instantiate with their default configuration in tact
        top.dawgMap.addTool("dawgmap/tool/LegendTool", {name: "Legend", label: "Show Map Legend"});
        //top.dawgMap.addTool("dawgmap/tool/LayerListTool");
        top.dawgMap.addTool("dawgmap/tool/OpacitySliderTool", {name: "OpacitySlider", label: "Control Layer Display" });
        top.dawgMap.addTool("dawgmap/tool/BaseMapGalleryTool", {name: "BaseMapGallery", label: "Change Base Map" });
        top.dawgMap.addTool("dawgmap/tool/LocateTool", {name: "Locate", label: "Search Map" });
        top.dawgMap.addTool("dawgmap/tool/PrintTool", {name: "Print", label: "Print" });
        top.dawgMap.addTool("dawgmap/tool/SelectionLayerListTool", {
            layerIds: ["Project_Survey", "Reviews"]
        });
        top.dawgMap.addTool("dawgmap/tool/NavNext", { name: "NavNext", label: "Show Next Map Extent" });
        top.dawgMap.addTool("dawgmap/tool/NavPrevious", { name: "NavPrevious", label: "Show Last Map Extent" });
        top.dawgMap.addTool("dawgmap/tool/ZoomFullTool", { name: "ZoomFull", label: "Zoom to Full Extent" });
        top.dawgMap.addSnippet("dawgmap/snippet/ReviewTab");
        top.dawgMap.addSnippet("dawgmap/snippet/ProjectTab");
        top.dawgMap.addSnippet("dawgmap/snippet/SurveyTab");
        top.dawgMap.addSnippet("dawgmap/snippet/AlertTab");
        top.dawgMap.addSnippet("dawgmap/snippet/DragDropData");

        top.dawgMap.on("init-complete", function ()
        {
            var tool = top.dawgMap.getTool("SelectionLayerList"); // retrieve the tool after initialization and do something with it.
        });

        
        request.post(sitePath + "/Home/LayerConfig").then(
                function (data) {
                    var layers = JSON.parse(data);
                    for (i = 0; i < layers.length; i++) {
                        if (layers[i].type === "image") {
                            top.dawgMap.addLayer(
                                    new ImageServiceLayer(layers[i].url, {
                                        id: layers[i].id,
                                        name: layers[i].name,
                                        visible: layers[i].visible,
                                        //opacity: layers[i].opacity,
                                        infoTemplate: {
                                        }
                                    })
                                    );
                        }
                        if (layers[i].type === "dynamic") {
                            top.dawgMap.addLayer(
                                    new DynamicServiceLayer(layers[i].url, {
                                        id: layers[i].id,
                                        name: layers[i].name,
                                        visible: layers[i].visible,
                                        visibleLayers: layers[i].visibleLayers,
                                        indivLayersVisible: layers[i].indivLayersVisible, // controls which layers appear by default
                                        outFields: ["*"],
                                        infoTemplates: {
                                        }
                                    })
                                    );
                        }
                        if (layers[i].type === "feature") {                     
                            top.dawgMap.addLayer(
                                    new FeatureLayer(layers[i].url, {
                                        id: layers[i].id,
                                        name: layers[i].name,
                                        visible: layers[i].visible,
                                        visibleLayers: layers[i].visibleLayers,
                                        indivLayersVisible: layers[i].indivLayersVisible, // controls which layers appear by default
                                        outFields: ["*"],
                                        setDefinitionExpression: layers[i].queryPredicate,
                                        infoTemplate: {}

                                    })
                            );
                                    
                        }

                        if (layers[i].type === "webTileLayer") { //dholcomb: add webTileLayers to Layer widget
                            top.dawgMap.addLayer(
                                new esri.layers.WebTiledLayer(layers[i].url, {
                                id: layers[i].id,
                                opacity: layers[i].opacity,
                                visible: layers[i].visible
                            }));
                            //map.addLayer(webTiledLayer);
                            // map.reorderLayer(webTiledLayer, 1); //dholcomb: always put webTiledLayers on bottom
                        }

                    };

                  
                    top.dawgMap.initialize();
                },
                function (error) {
                    alert(error);
                }

        );
    
    });            
});  

