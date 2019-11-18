define([
	'dojo/_base/declare',
        'esri/graphic',
        'esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol'
], function (
	declare,
        Graphic,
        Point,
        SimpleMarkerSymbol
) {
    return declare([], {
        name : "DrawPoints", 
        map : null,
        /*
         * Creates a new ZoomToPoint.
         * 
         * @classdesc
         * The layer manager provides a lot of the heavy lifting for interacting
         * with layers on the map. It keeps track of all layers that have been
         * added, and adds all of them to the map simultaneously once dawgmap is initialized.
         * Also provides some convenience methods to tools for retrieving layers.
         * 
         * @memberof core
         * @constructor ZoomToPoint
         * @param {type} map - A reference to the esri map object, set automatically.
         */
        constructor : function(map) {
                this.map = map;
        },
    
        byCordinates : function(cordinates) {
            var point;
            var symbol = new SimpleMarkerSymbol(
                    {"color":[255,0,0,255],
                    "size":7,
                    "angle":0,
                    "xoffset":0,
                    "yoffset":0,
                    "type":"esriSMS",
                    "style":"esriSMSCircle",
                    "outline":{"color":[0,0,0,255],
                        "width":1,
                        "type":"esriSLS",
                        "style":"esriSLSSolid"}
            });
            
            this.map.graphics.clear();
            for (var i = 0; i < cordinates.length; i++) {
                point = new Point(cordinates[i][0], cordinates[i][1]);
                this.map.graphics.add(new Graphic(
                    // Point coordinates are 0, 0
                    point,
                    symbol
                ));
            }
	}
        
    });
    
});

