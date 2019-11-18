
define([
	'dojo/_base/declare',
        'dojo/_base/array',
	'dojo/Evented',
	'esri/layers/FeatureLayer',
	'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/layers/ArcGISImageServiceLayer',
		        'esri/layers/WebTiledLayer',
        'esri/InfoTemplate',
	'dojo/on'
],function(
	declare, 
        array,
	Evented,
	FeatureLayer,
	DynamicServiceLayer,
        ImageServiceLayer,
		WebTiledLayer,
        InfoTemplate,
        on
){
	return declare([Evented], {
		/**
		 * An array of layers that have been added to the layer manager.
		 * 
		 * @private
		 * @name core.LayerManager#layers
		 * @type Array
		 */
		layers : [],
		handlers : [],
		/**
		 * Whether or not the map has been initialized.
		 * 
		 * @private
		 * @name core.LayerManager#initialized
		 * @type Array
		 */
		initialized : false,
		map : null,
		/**
		 * Creates a new LayerManager.
		 * 
		 * @classdesc
		 * The layer manager provides a lot of the heavy lifting for interacting
		 * with layers on the map. It keeps track of all layers that have been
		 * added, and adds all of them to the map simultaneously once dawgmap is initialized.
		 * Also provides some convenience methods to tools for retrieving layers.
		 * 
		 * @memberof core
		 * @constructor LayerManager
		 * @param {type} map - A reference to the esri map object, set automatically.
		 * @param {type} config - Optional configuration object
		 * @return {LayerManager} - The new LayerManager
		 */
		constructor : function(map, config) {
			this.map = map;
		},
		/**
		 * Adds all of the layers to the map.
		 * 
		 * @instance
		 * @public
		 * @memberof core.LayerManager
		 */
		initialize : function() {
			var that = this;
			this.map.addLayers(this.layers);
		},
		/**
		 * Adds a layer to the array of managed layers
		 * 
		 * @instance
		 * @public
		 * @memberof core.LayerManager
		 * @param {DawgMapLayer|FeatureLayer|ArcGISDynamicServiceLayer} layer - A layer object
		 * @returns {undefined}
		 */
		add: function(layer) {
			var that = this;
			this.layers.push(layer);
			this.handlers.push(layer.on("visibility-change",function(data) {
				that.emit("layer-visibility-changed", {
					layer : layer
				});
			}));
			this.handlers.push(layer.on("visible-layers-change", function(data) {
				that.emit("layer-visibility-changed", {
					layer : layer
				});
			}));
			if(this.initialized) {
				this.map.addLayer(layer);
				this.emit("manager-add-layer", { id : layer.id });
			}
        },
        /**
		 * Removes a layer to the array of managed layers
		 * 
		 * @instance
		 * @public
		 * @memberof core.LayerManager
		 * @param {DawgMapLayer|FeatureLayer|ArcGISDynamicServiceLayer} layer - A layer object
		 * @returns {undefined}
		 */
        removeCOD: function (CODlayers) {
            var that = this;
            for (var cd in CODlayers) {
                for (i = this.layers.length; i--;) {
                    var lt = this.layers[i];
                    if (CODlayers[cd].id && lt.id) {
                        if (CODlayers[cd].id === lt.id) {
                            this.layers.splice(i, 1);
                            this.map.removeLayer(CODlayers[cd]);
                            this.emit("manager-remove-layer", { id: CODlayers[cd].id });
                        }
                    }
                }
            }
        },
		/**
		 * Fetches a list of all managed layer ids.
		 * 
		 * @instance
		 * @public
		 * @memberof core.LayerManager
		 * @returns {Array} The list of layers.
		 */
		getLayerIds : function() {
			var ids = [];
			var that = this;
			dojo.forEach(this.layers, function(layer, index) {
				ids.push(layer.id);
			});
			return ids;
		},
		/**
		 * Fetches a list of all layers and their current visibility and names.
		 * 
		 * @instance
		 * @public
		 * @memberof core.LayerManager
		 * @returns {Array} The list of layers.
		 */
                 getLayerList : function() {
                    var layerInfo = [];
                    dojo.forEach(this.layers, function(layer, index){
                            if(layer.isInstanceOf(FeatureLayer)) {
                                    layerInfo[index] = {
                                            id : layer.id,
                                            name : layer.name,
                                            visible : layer.visible
                                    };
                            } else if(layer.isInstanceOf(DynamicServiceLayer)) {
                                    layerInfo[index] = {
                                            id : layer.id,
                                            name : layer.name ? layer.name : layer.id,
                                            visible : layer.visible,
                                            visibleLayers: layer.visibleLayers,
                                            indivLayersVisible : layer.indivLayersVisible,
                                            layerInfos : layer.layerInfos,
                                            outFields: ["*"]
                                    }
                            } else {
                                layerInfo[index] = {
                                    id: layer.id,
                                    name: layer.name ? layer.name : layer.id,
                                    visible: layer.visible
                                }
                            }
                    });
                    return layerInfo;
		},
                
                /**
		 * Fetches a list of all layers and their current visibility and names.
		 * 
		 * @instance
		 * @public
		 * @memberof core.LayerManager
                 * @param {ids} An array of layer ids
		 * @returns {Array} The list of layers.
		 */
                 getLayerListFromIds : function(ids) {
                    var layerInfo = [];
                    var index;
                    dojo.forEach(this.layers, function(layer){
                        index = array.indexOf(ids, layer.id)
                        if (index >= 0) {
                            if(layer.isInstanceOf(FeatureLayer)) {
                                    layerInfo[index] = {
                                            id : layer.id,
                                            name : layer.name,
                                            visible : layer.visible
                                    };
                            } else if(layer.isInstanceOf(DynamicServiceLayer)) {
                                    layerInfo[index] = {
                                            id : layer.id,
                                            name : layer.name ? layer.name : layer.id,
                                            visible : layer.visible,
                                            visibleLayers: layer.visibleLayers,
                                            indivLayersVisible : layer.indivLayersVisible,
                                            layerInfos : layer.layerInfos,
                                            outFields: ["*"]
                                    }
                            } else {
                                layerInfo[index] = {
                                    id: layer.id,
                                    name: layer.name ? layer.name : layer.id,
                                    visible: layer.visible
                                }
                            }
                        }
                    });
                    return layerInfo;
		}
	});
});

