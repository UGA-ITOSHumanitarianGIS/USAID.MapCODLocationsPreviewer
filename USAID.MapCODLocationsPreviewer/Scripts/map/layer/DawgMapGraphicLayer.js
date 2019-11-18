define([
	'dojo/_base/declare',
	'esri/layers/GraphicsLayer',
        'esri/geometry/Point',
        'esri/SpatialReference',
        'esri/Graphic',
        'esri/symbols/SimpleMarkerSymbol',
	'esri/InfoTemplate'
], function(
	declare,
	GraphicsLayer,
        Point,
        SpatialReference,
        Graphic,
        SimpleMarkerSymbol,
	InfoTemplate
) {
	return declare([GraphicsLayer], {
		/**
		 * Creates a new DawgMapGraphicsLayer.
		 * 
		 * @classdesc Wrapper class for Esri GraphicsLayer. Provides consistency in the framework.
		 * 
		 * @memberof layer
		 * @constructor DawgMapGraphicsLayer
		 * @param {String} data - Url to the layer
		 * @returns {DawgMapGraphicsLayer} The DawgMapGraphicsLayer
		 */
		constructor : function() {
                    
                },
                        
                dawGraphics : function(data) {
                    var symbol = new SimpleMarkerSymbol();
                    symbol.setStyle(SimpleMarkerSymbol.STYLE_SQUARE);
                    symbol.setSize(10);
                    symbol.setColor("#f8f805");
                    var infoTemplate = new InfoTemplate("Mitigated Property", "Name: ${name}<br />Address: ${address}<br /><img src= '../Images/btn_edit.gif' alt= 'Edit' title = 'Edit' style = 'cursor:pointer' onclick='window.parent.mapFrame.SimpleEdit(${editid});'>");
                    var graphics = [];
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        var attributes = { address: item.Address, name: item.Name, editid: item.EditId };

                        var point = new Point(
                               item.Longitude,
                               item.Latitude,
                              new SpatialReference({ wkid: 4326 })
                           );

                        var graphic = new Graphic(point, symbol, attributes, infoTemplate);
                        //add a graphic to the map at the geocoded location
                        this.add(graphic);
                        graphics.push(graphic);
                    }
//                    if (graphics.length > 0) {
//                        var extent = graphicsExtent(graphics);
//                        if (extent) {
//                            map.setExtent(extent);
//                        }
//                    }
		}
	});
});
