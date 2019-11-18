define([
	'dojo/_base/declare',
	'dawgmap/tool/base/BasePanelTool',
    'esri/layers/FeatureLayer',
    'esri/layers/GraphicsLayer',
    'esri/graphic',
    'esri/config',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/Color',
    'esri/toolbars/draw',
    'dojo/on'
], function (
    declare,
    BasePanelTool,
    FeatureLayer,
    GraphicsLayer,
    Graphic,
    esriConfig,
    SimpleFillSymbol,
    SimpleLineSymbol,
    Color,
    Draw,
    on
    )
{
    return declare([], {
        name: "SurveyTab",
        label: "Survey Tab",
        polyLayer: null,
        geometryService: null,
        drawToolbar: null,
        config: {
            message: "Draw Survey"
        },
       
        
        constructor: function (map)
        {
            this.map = map;
            this.drawToolbar = new Draw(this.map);
            var newSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                  new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                 new Color([0, 92, 230]), 2.667), new Color([255, 255, 255, 0]));
            this.drawToolbar.setFillSymbol(newSymbol);    

            this.inherited(arguments); // calls parent class' startup method

            this.bindHandlers();

        },

        onHide: function ()
        {
            // reset the buttons content whenever the tool is hidden
            this.button.innerHTML = "Add Survey";
            this.drawToolbar.deactivate();
        },

        bindHandlers: function ()
        {
            var that = this;

            this.button = dojo.query("#addSurveyButton"); //find the button
            this.button = this.button[0]; // narrow down list of returned nodes
            on(this.button, "click", function ()
            {
                that.drawToolbar.activate(Draw.POLYGON);
                that.map.setInfoWindowOnClick(false);
            });

            //Stop drawing when clicking tabs
            jQuery(function ($)
            {
                $(document).ready(function ()
                {

                    $("#esriCTsearchContainerProjectArea").click(function ()
                    {
                        that.drawToolbar.deactivate();
                    });

                    $("#esriCTsearchContainerReview").click(function ()
                    {
                        that.drawToolbar.deactivate();
                    });

                });
            });

            this.drawToolbar.on("DrawEnd", function (geometry)
            {
                //code when drawing is finished to reset the table
            });

        }

    });
});


