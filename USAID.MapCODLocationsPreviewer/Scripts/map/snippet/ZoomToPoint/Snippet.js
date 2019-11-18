define([
	'dojo/_base/declare',
        'esri/graphic',
        'esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/geometry/webMercatorUtils'
], function (
	declare,
        Graphic,
        Point,
        SimpleMarkerSymbol,
        WebMercatorUtils
) {
    return declare([], {
        name : "ZoomToPoint",
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
    
        byLatLon : function(lat, lon) {
            var point = new Point(lat, lon);
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
            this.map.graphics.add(new Graphic(
                // Point coordinates are 0, 0
                point,
                symbol
            ));
            this.map.centerAndZoom(point, 10);
	},
        
        byXY : function(x, y) {
            var latLon = WebMercatorUtils.xyToLngLat(x, y);
            var point = new Point(latLon[0], latLon[1]);
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
            this.map.graphics.add(new Graphic(
                // Point coordinates are 0, 0
                point,
                symbol
            ));
            this.map.centerAndZoom(point, 10);
	}
        
    });
    
});

