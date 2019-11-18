/**
 * @namespace layer
 * @instance
 */
define([
	'dojo/_base/declare',
	'esri/layers/ArcGISDynamicMapServiceLayer',
	'esri/InfoTemplate'
], function(
	declare,
	DynamicServiceLayer,
	InfoTemplate
) {
	return declare([DynamicServiceLayer], {
		/**
		 * A label to give to the layer for the layer list tool to display.
		 * 
		 * @private
		 * @name layer.DawgMapServiceLayer#name
		 * @type String
		 */
		name : "",
		/**
		 * Creates a new DawgMapServiceLayer
		 * 
		 * @classdesc Wrapper class for Esri ArcGISDynamicMapServiceLayers. Provides convenient
		 * defaults, and an easier way to set up info templates for new dynamic
		 * service layers.
		 * 
		 * @memberof layer
		 * @constructor DawgMapServiceLayer
		 * @param {String} url - Url to the map service
		 * @param {Object} config - Config object, same parameters as the ArcGISDynamicMapServiceLayer config object.
		 * @returns {DawgMapServiceLayer} The DawgMapServiceLayer
		 */
		constructor : function(url, config) {
			this.inherited(arguments);
			this.name = arguments[1].name;
                        this.visible = this.setUpVisibility(config);
                        this.visibleLayers = config.visibleLayers;
                        this.indivLayersVisible = config.indivLayersVisible;
			arguments[1].infoTemplates = this.setUpInfoTemplates(config.infoTemplates);
			this.setVisibleLayers(config.indivLayersVisible);
                        this.infoTemplates = this.setUpInfoTemplates(config.infoTemplates);
                        this.on("selection-complete", arguments[1].selectionComplete ? arguments[1].selectionComplete : this.selectionComplete);
		},
                
                selectionComplete : function() {
                },
		/**
		 * Sets up infotemplates for the layer via json config instead of requiring
		 * that info templates be instantiated manually.
		 * 
		 * @instance
		 * @memberof layer.DawgMapServiceLayer
		 * @param {Object} infoTemplates - List of info template json configurations
		 *	keyed by the layer id they correspond to in the service.
		 * @returns {Object} The modified infoTemplates object. 
		 */
		setUpInfoTemplates : function(infoTemplates) {
			for(var v in infoTemplates) {
				if(infoTemplates.hasOwnProperty(v)) {
					var infoTemplate = infoTemplates[v];
					if(typeof infoTemplate.infoTemplate === "object") {
						if(typeof infoTemplate.infoTemplate.title === "string"
								&& typeof infoTemplate.infoTemplate.content === "string") {
							this.infoTemplate = new InfoTemplate(infoTemplate.infoTemplate)
						} else {
							var title = infoTemplate.infoTemplate.title;
							var content = infoTemplate.infoTemplate.content;
							this.infoTemplate = new InfoTemplate(title,content);
						}
					}
				}
			}
			return infoTemplates;
		},
                
                setUpVisibility : function(layerConfig) {
                 var visibleLayerIds = [];
		    var isVis = false;
		    if (layerConfig.visible != "undefined" && layerConfig.visible == true) {
		        if (typeof layerConfig.indivLayersVisible != "undefined") {
		            if (layerConfig.indivLayersVisible.length > 0) {
                        
		                for (var i = 0; i < layerConfig.indivLayersVisible.length; i++) {
		                    visibleLayerIds.push(layerConfig.indivLayersVisible[i]);
		                }
		                isVis = true;
		            };
		        }
		    }
                    return isVis;
                }
	});
});

