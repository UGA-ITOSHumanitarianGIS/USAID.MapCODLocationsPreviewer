define([
	'dojo/_base/declare',
	'dawgmap/tool/base/BasePanelTool',
    'esri/layers/FeatureLayer',
    'esri/layers/GraphicsLayer',
    'esri/graphic',
    'esri/tasks/GeometryService',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/dijit/editing/Editor',
    'esri/map',
    'esri/Color',
    'esri/toolbars/draw',
    'esri/toolbars/edit',
    'dojo/on',
    'dojo/i18n!esri/nls/jsapi',
    'dojo/_base/array',
    'dojo/keys',
    'dojo/parser',
    'dojo/domReady!'
    //need to be cleaned and only keep the useful ones

], function (
    declare,
    BasePanelTool,
    FeatureLayer,
    GraphicsLayer,
    Graphic,
    GeometryService,
    SimpleFillSymbol,
    SimpleLineSymbol,
    Editor,
    Map,
    Color,
    Draw,
    Edit,
    on,
    arrayUtils,
    keys,
    parser
    //need to be cleaned and only keep the useful ones

    ) {
    return declare([BasePanelTool], {
        name: "DrawTool",
        label: "Draw Features",
        polyLayer: null,
        geometryService: null,
        drawToolbar: null,
        _css: {
            container: "selectionToolContainer",
            bufferContainer: "bufferContainer"
        },
        config: {
            message: "Draw Project Area"

        },
        constructor: function (config) {
            this.drawToolbar = new Draw(this.map);
            var newSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                  new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                 new Color([255, 0, 0]), 2.667), new Color([255, 255, 255, 0]));
            this.drawToolbar.setFillSymbol(newSymbol);

            this.inherited(arguments); // calls parent class' startup method

            //var that = this;
            // in order to refer to properties of this class within this anonymous callback function, 
            // the 'this' keyword must be assigned to a variable
            this.bindHandlers();
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
            on(this.button, "click", function () {

      

            });

            //Stop drawing when clicking tabs
            jQuery(function ($) {
                $(document).ready(function () {
                    $("#esriCTsearchContainerSurvey").click(function () {
                        that.drawToolbar.deactivate();
                    });

                    $("#esriCTsearchContainerProjectArea").click(function () {
                        that.drawToolbar.deactivate();
                    });

                    $("#esriCTsearchContainerReview").click(function () {
                        that.drawToolbar.deactivate();
                    });
                });
            });

            this.drawToolbar.on("DrawEnd", function (geometry) {
                //after draw code here.
            });
        }
    });
});


