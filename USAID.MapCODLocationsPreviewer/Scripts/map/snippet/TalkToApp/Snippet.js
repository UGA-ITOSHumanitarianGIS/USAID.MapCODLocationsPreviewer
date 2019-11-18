define([
    'dojo/_base/declare',
    'dojo/_base/array'
], function (
        declare, 
	arrayUtils
) {
    return declare([], {
        name : "TalkToApp",
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
        constructor : function() {
        },
        
                        
        historic : function  (event) {
            var ids = "";
            var i = 0;
            arrayUtils.forEach(event.features, function (feature) {
                ids += feature.attributes.r_id + ",";
                i += 1;
            });
            //your app function to pass ids to here
        },
        
        archaeologic : function  (event) {
            var ids = "";
            var i = 0;
            arrayUtils.forEach(event.features, function (feature) {
                ids += feature.attributes.id + ",";
                i += 1;
            });
            //your app function to pass ids to here
        }
        
    });
        
});