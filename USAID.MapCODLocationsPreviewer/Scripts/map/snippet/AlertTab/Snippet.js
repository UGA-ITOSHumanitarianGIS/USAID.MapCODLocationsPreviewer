define([
	'dojo/_base/declare',
	'dawgmap/tool/base/BasePanelTool',
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
    "esri/layers/FeatureLayer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "dojo/dom",
    "dojo/json",
    "dojo/sniff",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dojo/domReady!"
], function (
    declare, BasePanelTool, Graphic, GeometryService, SimpleFillSymbol, SimpleLineSymbol,
    Map, Color, Draw, on, InfoTemplate, request, scaleUtils, FeatureLayer, SimpleRenderer,
    SimpleFillSymbol, SimpleLineSymbol, dom, JSON, sniff, arrayUtils, lang
    ) {
    return declare([], {
        name: "AlertTab",
        label: "Alert Tab",
        polyLayer: null,
        geometryService: null,
        drawToolbar: null,
        config: {
            message: "Alert"
        },

        constructor: function (map) {
            this.map = map;
            this.drawToolbar = new Draw(this.map);
         
            this.inherited(arguments); // calls parent class' startup method
            this.bindHandlers();
        },

        onHide: function () {
            // reset the buttons content whenever the tool is hidden
           // this.button.innerHTML = "Draw Project Area";
         //   this.drawToolbar.deactivate();
        },

        bindHandlers: function () {

            var that = this;
          


          

        
            function errorHandler(error) {
                //dom.byId('upload-status').innerHTML =
                //"<p style='color:red'>" + error.message + "</p>";
            }

         
         
        }
    });
});