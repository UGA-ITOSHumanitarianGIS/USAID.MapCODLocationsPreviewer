define([
    'esri/toolbars/edit',
    'dojo/_base/declare',
    'dawgmap/tool/base/BasePanelTool',
    'dawgmap/layer/DawgMapServiceLayer',
    'dawgmap/layer/DawgMapFeatureLayer',
    'esri/graphic',
    'esri/tasks/GeometryService',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/map',
    'esri/Color',
    'esri/toolbars/draw',
    'dojo/on',
    "esri/InfoTemplate",
    "esri/request",
    "esri/geometry/scaleUtils",
    'esri/geometry/geometryEngine',
    "esri/geometry/webMercatorUtils",
    "esri/geometry/Polygon",
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    "esri/layers/FeatureLayer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "dojo/dom",
    "dojo/json",
    "dojo/sniff",
    "dojo/Deferred",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/event",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dojo/domReady!"

], function (
    Edit, declare, BasePanelTool, DynamicServiceLayer, dawgMapFeatureLayer, Graphic, GeometryService, SimpleFillSymbol, SimpleLineSymbol, Map, Color, Draw, on,
    InfoTemplate, request, scaleUtils, geometryEngine, webMercatorUtils, Polygon, Query, QueryTask,
    FeatureLayer, SimpleRenderer, SimpleFillSymbol, SimpleLineSymbol, dom, JSON, sniff, Deferred, arrayUtils, lang, event
    )
{
    return declare([], {
        name: "ProjectTab",
        label: "Project Tab",
        polyLayer: null,
        geometryService: null,
        drawToolbar: null,
        editToolbar: null,
        editingEnabled: null,
        config: {
            message: "Draw Project Area"
        },
        constructor: function (map) {
            this.map = map;
            this.drawToolbar = new Draw(this.map);
            this.editToolbar = new Edit(this.map);
            this.inherited(arguments); // calls parent class' startup method
            this.bindHandlers();
            this.editingEnabled = false;
        },

        onHide: function () {
            // reset the buttons content whenever the tool is hidden
            this.button.innerHTML = "Draw Project Area";
            this.drawToolbar.deactivate();
        },

        bindHandlers: function () {

            var that = this;
            this.button = dojo.query("#drawProjectAreaButton"); //find the button
            this.button = this.button[0]; // narrow down list of returned nodes

            on(dojo.query("#drawProjectAreaButton"), "click", function () {
                //that.button.innerHTML = that.config.message;
                document.getElementById('uploadProjectAreaButton').style.visibility = "hidden";
                document.getElementById('uploadProjectAreaButton').style.display = "none";
                that.drawToolbar.activate(Draw.POLYGON);
                that.map.setInfoWindowOnClick(false);
            });
            jQuery(function ($) {
                $(document).ready(function () {

                    $("#esriCTsearchContainerProjectArea").click(function () {
                        that.drawToolbar.deactivate();
                    });

                    $("#esriCTsearchContainerReview").click(function () {
                        that.drawToolbar.deactivate();
                    });

                 
                    $("#selectionCODCountry").on('change', function () {
                        var country_id = $("#selectionCODCountry option:selected").val();
                        //todo match the iso with the countryname to show the name in the list.
                        //console.log(sitePath + '/Proxy/Index?https://gistmaps.itos.uga.edu/arcgis/rest/services/COD_External/' + country_id + '/MapServer/?f=json');
                        //var country_id = $('selectionCODCountry').find("option:selected").text();

                        $.ajax({
                            type: 'GET',
                            url: sitePath + '/Proxy/Index?https://gistmaps.itos.uga.edu/arcgis/rest/services/COD_External/' + country_id + '/FeatureServer/?f=json',
                            dataType: "json",
                            contentType: "application/json",
                            success: function (result) {
                                //depth of admins for grid
                                var hasAdmin3 = false;
                                for (var ld in result.layers) {
                                    var lName = result.layers[ld].name;
                                    if (lName == "Admin3")
                                        hasAdmin3 = true;
                                }
                                //remove layer routine
                                var edUrl = "";
                                //add layers routine
                                var layerControl = top.dawgMap.getTool("OpacitySlider");
                                var layerManager = top.dawgMap.layerManager;
                                var CODLoadedLayers = [];
                                layerControl.hide();
                                for (i = 0; i < top.dawgMap.map.graphicsLayerIds.length; i++) {
                                    var gl = top.dawgMap.map.getLayer(top.dawgMap.map.graphicsLayerIds[i]);
                                    if (gl.url != null ) {
                                        if (gl.url.indexOf("COD_External") > -1) {
                                            CODLoadedLayers.push(gl);   
                                        }
                                    }
                                }                          
                                layerManager.removeCOD(CODLoadedLayers);
                                layerManager.getLayerList();
                             
                                for (i = 0; i < result.layers.length; i++) {
                                    edUrl = "https://gistmaps.itos.uga.edu/arcgis/rest/services/COD_External/" + country_id + "/FeatureServer/" + result.layers[i].id;
                                    top.dawgMap.addLayer(
                                        new dawgMapFeatureLayer(edUrl, {
                                            id: country_id + "_" + result.layers[i].id,
                                            name: result.layers[i].name,
                                            visible: result.layers[i].defaultVisibility,
                                            visibleLayers: "[" + result.layers[i].id + "]",
                                            indivLayersVisible: "[" + result.layers[i].id + "]", // controls which layers appear by default
                                            outFields: ["*"],
                                            setDefinitionExpression: result.layers[i].queryPredicate,
                                            infoTemplate: {}
                                        })
                                    );
                                    if (hasAdmin3 && i == 3) {
                                        sitescript.loadProjectAreas(edUrl);
                                    } else {
                                        if (!hasAdmin3 && i == 2)
                                            sitescript.loadProjectAreas(edUrl);
                                    }
                                }
                                top.dawgMap.initialize();
                                var countryExtent = new esri.geometry.Extent(result.initialExtent.xmin, result.initialExtent.ymin, result.initialExtent.xmax, result.initialExtent.ymax,
                                    new esri.SpatialReference(result.initialExtent.spatialReference));
                                that.map.setExtent(countryExtent, true);
                                
                            },
                            error: function (data) {
                                console.log(data.initialExtent);
                              
                            }

                        }); 
                    });
                });
            });
        }
    });
});


