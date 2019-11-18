define([
    'dojo/_base/array',
    'dojo/_base/declare',
	'dawgmap/tool/base/BasePanelTool',
    'esri/layers/layer',
    'esri/graphic',
    'esri/tasks/GeometryService',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/tasks/BufferParameters',
    'esri/geometry/normalizeUtils',
    'esri/geometry/Extent',
    'esri/geometry/Polyline',
    'esri/geometry/Polygon',
    'esri/geometry/geometryEngine',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'esri/tasks/DistanceParameters',
    'esri/tasks/GeometryService',
    'esri/map',
    'esri/graphicsUtils',
    'esri/Color',
    'esri/config',
    'esri/toolbars/draw',
    'dojo/on',
    'esri/tasks/DistanceParameters',
    'esri/SpatialReference',
    'esri/geometry/webMercatorUtils',
    'dojo/Deferred',
    'dojo/promise/all'

], function (
    array,
    declare,
    BasePanelTool,
    Layer,
    Graphic,
    GeometryService,
    SimpleFillSymbol,
    SimpleLineSymbol,
    BufferParameters,
    normalizeUtils,
    Extent,
    Polyline,
    Polygon,
    geometryEngine,
    Query,
    QueryTask,
    DistanceParameters,
    GeometryService,
    Map,
    graphicsUtils,
    Color,
    esriConfig,
    Draw,
    on,
    DistanceParameters,
    SpatialReference,
    webMercatorUtils,
    Deferred,
    all
    )
{
    return declare([],
        {
            name: "ReviewTab",
            label: "Review Tab",
            polyLayer: null,
            geometryService: null,
            drawToolbar: null,
            constructor: function (map) {
                this.map = map;
                this.geometry = null;
                this.review_project_id = -1;

                this.review_id = -1;
                this.location_id = -1;
                this.drawToolbar = new Draw(this.map);
                var newSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([255, 200, 0]), 3), new Color([255, 255, 255, 0]));
                this.drawToolbar.setFillSymbol(newSymbol);

                reviewOccurrenceSet = [];
                reviewGeometrySet = [];
                reviewLonSet = [];
                reviewLatSet = [];
                esriConfig.defaults.geometryService = new GeometryService("https://mapsdev.itos.uga.edu/arcgis/rest/services/Utilities/Geometry/GeometryServer");

                this.inherited(arguments); // calls parent class' startup method      
                this.bindHandlers();

            },

            onHide: function () {
                // reset the buttons content whenever the tool is hidden
                this.button.innerHTML = "Draw Review Area";
                this.drawToolbar.deactivate();
            },

            bindHandlers: function () {
                var that = this;
                this.button = dojo.query("#drawReviewButton"); //find the button
                this.button = this.button[0]; // narrow down list of returned nodes
                on(this.button, "click", function () {
                    that.drawToolbar.activate(Draw.POLYGON);
                    //that.map.getLayer("Project_Survey").clearSelection();
                    that.map.setInfoWindowOnClick(false);
                });

                jQuery(function ($) {
                    $(document).ready(function () {

                     

                        //stop drawing when clicking tabs
                        $("#esriCTsearchContainerProjectArea").click(function () {
                            that.drawToolbar.deactivate();
                        });

                        //stop drawing when clicking tabs
                        $("#esriCTsearchContainerReview").click(function () {
                            that.drawToolbar.deactivate();
                        });

                        //loading project list
                        window.onload = function () {
                            that.drawToolbar.deactivate();
                        }


                    });
                });
                 

            }
                        
            
            });
        
    //delete review

                        
    //intersect, show on map and in the kendo grid
    function makeReview()
    {
        jQuery(function ($)
        {
            $(document).ready(function ()
            {
                //your code here.
            });
        });


        function addOccurence(OccType, OccName, SNAME, USESA, SPORT, Direction, Distance, SiteId, result, SurveySite, Biotics_Id, Latitude, Longitude, Data, occurrenceSet)
        {
            //replace null with ""
        
            //update Data
          
            //update occurrenceSet
        
            //update result
        
        }
    }

    function saveReviewPolygon(locationId, geometry)
    {
        //your code here
    }

    function clearKendoGrid()
    {
        jQuery(function ($)
        {
            $(document).ready(function ()
            {
            //your code here.

            });
        });
    }
});

