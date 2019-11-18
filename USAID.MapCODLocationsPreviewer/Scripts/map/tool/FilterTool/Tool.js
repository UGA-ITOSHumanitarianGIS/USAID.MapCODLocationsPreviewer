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
        name: "FilterTool",
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

            this.bindHandlers();

        },

        onHide: function () {
            // reset the buttons content whenever the tool is hidden
            this.button.innerHTML = "Draw Project Area";
            this.drawToolbar.deactivate();
        },

        bindHandlers: function () {

            var that = this;

            this.button = dojo.query("#btnTestDraw"); //find the button
            this.button = this.button[0]; // narrow down list of returned nodes
            on(this.button, "click", function () {
                
                var polygonId = jQuery("#hiddenGnahrgisLocationId").val();

                jQuery.ajax({
                    type: "GET",
                    url: "YourUrl" + polygonId.toString(),
                    contentType: "application/json",
                })
                .success(function (data) {
                    that.map.graphics.clear();
                    var poly = new Polygon(data);
                    that.map.graphics.Add(poly);
                    
                })
                .fail(function (data) {
                    
                })
                .always(function (data) {

                })
            });
        }
    });
});


