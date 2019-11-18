define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/dom-class',
	'../base/BasePanelTool',
	'esri/graphic',
	'esri/symbols/SimpleFillSymbol',
	'esri/symbols/SimpleLineSymbol',
	'esri/symbols/SimpleMarkerSymbol',
	'esri/toolbars/draw',
	'esri/tasks/query',
	'esri/layers/FeatureLayer',
	'esri/layers/GraphicsLayer',
	'esri/layers/ArcGISDynamicMapServiceLayer',
	'esri/tasks/IdentifyTask',
	'esri/tasks/IdentifyParameters',
	'esri/tasks/GeometryService',
	'esri/tasks/BufferParameters',
	'esri/SpatialReference',
	'esri/graphicsUtils',
	'dojo/on',
        'dojo/dom-construct',
	'require'
], function(
	declare, 
	arrayUtils,
	domClass,
	BasePanelTool, 
	Graphic,
	SimpleFillSymbol,
	SimpleLineSymbol,
	SimpleMarkerSymbol,
	Draw, 
	Query, 
	FeatureLayer, 
	GraphicsLayer,
	DynamicMapServiceLayer,
	IdentifyTask,
	IdentifyParameters,
	GeometryService,
	BufferParameters,
	SpatialReference,
	graphicsUtils, 
	on,
        domConstruct,
	require
) {
	return declare([BasePanelTool], {
		name : "SelectionLayerListTool",
		label: "Select Features And Layers",
                hasMenu : true,
	    /**
		 * Array of event handler references, needed to remove event handlers after
		 * binding.
		 * 
		 * @private
		 * @name tool.SelectionLayerListTool#handlers
		 * @type Array
		 */
		handlers: [],
                
                checked: [],
		/**
		 * A client side only graphics layer for displaying polygons. See the
		 * [GraphicsLayer documentation]{@link https://developers.arcgis.com/javascript/jsapi/graphicslayer-amd.html}
		 * for more information.
		 * 
		 * @type GraphicsLayer
		 * @name tool.SelectionLayerListTool#polyLayer
		 * @private
		 */
		polyLayer : null,
				/**
		 * A client side only graphics layer for displaying point markers. See the
		 * [GraphicsLayer documentation]{@link https://developers.arcgis.com/javascript/jsapi/graphicslayer-amd.html}
		 * for more information.
		 * 
		 * @type GraphicsLayer
		 * @name tool.SelectionLayerListTool#pointLayer
		 * @private
		 */
		pointLayer : null,
		/**
		 * A geometry service object for performing spatial queries.
		 * See the [GeometryService documentation]{@link https://developers.arcgis.com/javascript/jsapi/geometryservice-amd.html}
		 * for more information.
		 * 
		 * @type GeometryService
		 * @name tool.SelectionLayerListTool#geometryService
		 * @private
		 */
		geometryService : null,
		/**
		 * The drawing toolbar for enabling drawing of polygons for input to
		 * the geometry service. See the [Draw documentation]{@link https://developers.arcgis.com/javascript/jsapi/draw-amd.html}
		 * for more information.
		 * 
		 * @type Draw
		 * @name tool.SelectionLayerListTool#drawToolbar
		 * @private
		 */
		drawToolbar : null,
		_css : {
			container : "selectionToolContainer",
			bufferContainer: "bufferContainer",
		    list : "layer-list"
		},
		config : {
			layerIds : '*',
			geometryService : "https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",
			pointSelectionSymbol : { 
				"type":"esriSMS",
				"color" : [102,153,255,200],
				"style" : "esriSMSCircle",
				"size" : 5,
				"angle":0,
				"xoffset":0,
				"yoffset":0,
				"outline" : {
					"type":"esriSLS",
					"color" : [102,153,255,80],
					"width" : 1,
					"style" : "esriSLSSolid"
				}
			},
			polySelectionSymbol : {
				"type" : "esriSFS",
				"style" : "esriSFSSolid",
				"color" : [255, 153, 128 ,200],
				"outline" : {
					"type" : "esriSLS",
					"style" : "esriSLSSolid",
					"color" : [255, 51, 0,255],
					"width" : 1
				}
			},
			lineSelectionSymbol : {
				"type" : "esriSLS",
				"style" : "esriSLSSolid",
				"color" : [255, 51, 0,255],
				"width" : 2
			},
			layerSymbols : {
				
			},
			exclude: []
		},
		/**
		 * Sets the image location of all of the selection tool icons. This is done
		 * for the sake of portability. 
		 * 
		 * @memberof tool.SelectionTool
		 * @instance
		 * @override
		 */
		postCreate : function() {
			this._rectImage.src = require.toUrl("./img/icon_select_rect.png");
			this._lineImage.src = require.toUrl("./img/icon_select_line.png");
			this._polyImage.src = require.toUrl("./img/icon_select_poly.png");
			this._pointImage.src = require.toUrl("./img/icon_select_point.png");
		},
		/**
		 * Constructs a new SelectionTool and performs basic setup. Sets sensible
		 * config defaults.
		 * 
		 * @classdesc The SelectionTool allows users to select points an polygons
		 * by drawing shapes on the map. Users can select multiple geometries at a time
		 * by drawing a rectangle, a line, a polygon, or by selecting a point. 
		 * 
		 * @constructor SelectionTool
		 * @memberof tool
		 * @extends tool.base.BasePanelTool
		 * @param {Object} config - The configuration object for the selection tool
		 * @param {Array} config.layerIds - The ids of the layers to select from.
		 * @param {String} config.geometryService - The URL to the geometry service used for processing spatial queries.
		 * @param {Object} config.pointSelectionSymbol - An object describing the type of
		 *	marker symbol to use for selected point features. See the [Symbol Objects JSON guide]{@link http://help.arcgis.com/en/arcgisserver/10.0/apis/rest/symbol.html}
		 *	for more information.
		 * @param {Object} config.polySelectionSymbol - An object describing the type of symbol to use for selected polygon features.
		 * @param {Object} config.lineSelectionSymbol - An object describing the type of symbol to use for the selected polyline features.
		 * @returns {SelectionTool} - The selection tool
		 */
		constructor : function(config) {
			this.drawToolbar = new Draw(this.map);
			if(this.config.layerIds === '*') {
				this.config.layerIds = this.layerManager.getLayerIds();
			}
			this.queries = this.config.layerIds.length;
			this.polyLayer = new GraphicsLayer();
			this.pointLayer = new GraphicsLayer();
		},
		/**
		 * Deactivates any drawing whenever the tool's panel is hidden.
		 * 
		 * @override
		 * @instance
		 * @protected
		 * @memberof tool.SelectionTool
		 */
		onHide : function() {
			this.drawToolbar.deactivate();
			this.pointLayer.hide();
			this.polyLayer.hide();
			//this.map.graphics.clear();
		},
		onShow : function() {
			this.polyLayer.show();
			this.pointLayer.show();
		},
		/**
		 * Performs module setup, adds a graphics layer, creates the geometry service
		 * and binds event handlers.
		 * 
		 * @instance
		 * @override
		 * @memberof tool.SelectionTool
		 * @protected
		 */
		startup : function() {
			this.inherited(arguments);
			this.bindHandlers();
			this.geometryService = new GeometryService(this.config.geometryService);
			this.map.addLayer(this.pointLayer,1);
			this.map.addLayer(this.polyLayer, 0);
			this.injectLayerList(this.layerManager.getLayerListFromIds(this.config.layerIds));
		},
		/**
		 * Retrieves the geometry service constant corresponding to the correct
		 * unit based on an input string.
		 * 
		 * @instance
		 * @private
		 * @memberof tool.SelectionTool
		 * @param {String} formValue - Value of the unit selection dropdown
		 * @returns {GeometryService.UNIT_KILOMETER|GeometryService.UNIT_FOOT|GeometryService.UNIT_METER|GeometryService.UNIT_MILE} The Esri Unit.
		 * See the [GeometryService documentation]{@link https://developers.arcgis.com/javascript/jsapi/geometryservice-amd.html} for more information.
		 */
		convertUnits : function(formValue) {
			var units;
			switch(formValue) {
				case "ft":
					units = GeometryService.UNIT_FOOT;
					break;
				case "mi":
					units = GeometryService.UNIT_MILE;
					break;
				case "m":
					units = GeometryService.UNIT_METER;
					break;
				case "km":
					units = GeometryService.UNIT_KILOMETER;
					break;
			}
			return units;
		},
		/**
		 * Buffers a geometry based on the selected unit and buffer distance.
		 * 
		 * @instance
		 * @private
		 * @memberof tool.SelectionTool
		 * @param {Geometry} geometry - The input geometry. See the [Geometry documentation]{@link https://developers.arcgis.com/javascript/jsapi/geometry-amd.html} for more information.
		 */
		doBuffer : function(geometry) {
			var that = this;
			var params = new BufferParameters();
			params.distances = that._bufferDistance.value ? [that._bufferDistance.value] : [20];
			params.geometries = [geometry];
			params.bufferSpatialReference = that.map.spatialReference;
			params.outputSpatialReference = that.map.spatialReference;
			params.units = that._bufferToggle.checked ? 
				that.convertUnits(that._bufferUnits.value) : that.convertUnits("ft");
                                //console.log(params.units);
                                //console.log(that._bufferUnits.value);
			that.geometryService.buffer(params, function(geometries) {
				that.performQuery(geometries[0]);
			});
                        
		},
		/**
		 * Perform the query based on input geometry.
		 * 
		 * @private
		 * @memberof tool.SelectionTool
		 * @instance
		 * @param {Geometry} geometry - The input geometry. See the [Geometry documentation]{@link https://developers.arcgis.com/javascript/jsapi/geometry-amd.html} for more information.
		 */
		performQuery : function(geometry) {
			var query = new Query();
			var that = this;
			query.geometry = geometry;
			that.drawToolbar.deactivate();
			that.selections = [];
                        var layerChecked = false;
			arrayUtils.forEach(that.config.layerIds, function(layerID) {
				var layer = that.map.getLayer(layerID);
                                var checked = dojo.query('input[type=radio][name=layersList][id='+layerID)[0].checked;
                                if (checked) {
                                    layerChecked = true;
                                    if(layer.isInstanceOf(FeatureLayer)) {
                                            that.featureLayerSelect(layer,query);
                                    }
                                    else if(layer.isInstanceOf(DynamicMapServiceLayer)) {
                                            var params = new IdentifyParameters();
                                            params.geometry = geometry;
                                            params.mapExtent = that.map.extent;
                                            params.tolerance = 5;
                                            params.returnGeometry = true;
                                            params.layerIds = layer.layerIds;
                                            params.width = that.map.width;
                                            params.height = that.map.height;
                                            params.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
                                            that.identifyTaskSelect(layer, params);
                                    }
                                } 
			});
                        if (!layerChecked) {
                            alert("Please select a layer to proceed!");
                        }
		},
		/**
		 * Select from a feature layer.
		 * 
		 * @param {Layer} layer - An esri layer object
		 * @param {Query} query - An esri query object
		 */
		featureLayerSelect : function(layer, query) {
			var that = this;
			
			var selectionSymbol = that.getSymbol(layer.geometryType,layer.id);
			if(layer.geometryType === "esriGeometryPoint") {
				selectionSymbol = new SimpleMarkerSymbol(selectionSymbol);
			} else if(layer.geometryType === "esriGeometryLine") {
				selectionSymbol = new SimpleLineSymbol(selectionSymbol);
			} else {
				selectionSymbol = new SimpleFillSymbol(selectionSymbol);
			}
			layer.setSelectionSymbol(selectionSymbol);
			layer.selectFeatures(query, FeatureLayer.SELECTION_NEW);
		},
		/**
		 * Selects features in ArcGISDynamicServiceLayers.
		 * 
		 * @param {Layer} layer
		 * @param {IdentifyParameters} params - The parameters to the identify task.
		 * @returns {Deferred}
		 */
		identifyTaskSelect : function(layer, params) {
			var task = new IdentifyTask(layer.url);
			var that = this;
			return task.execute(params).addCallback(function(response) {
				var arr = arrayUtils.map(response, function(result) {
					var feature = result.feature;
					feature.type = result.geometryType;
					feature.attributes.layerName = result.layerName;
					feature.infoTemplate = layer.infoTemplates[result.layerId].infoTemplate;
					feature.symbol = that.getSymbol(result.geometryType, layer.id, response.layerId);
					return feature;
				});

				arrayUtils.forEach(arr, function(element,index) {
					var graphic = new Graphic({
						geometry : element.geometry,
						symbol : element.symbol,
						attributes : element.attributes
					});
					if(element.type === "esriGeometryPoint") {
						that.pointLayer.add(graphic);
					}
					else {
						that.polyLayer.add(graphic);
					}
				});			
				return arr;
			});
		},
		/**
		 * Clears the selected points from the map.
		 * 
		 * @memberof tool.SelectionTOol
		 * @instance
		 * @private
		 */
		_clearSelection : function() {
			this.map.graphics.clear();
			this.polyLayer.clear();
			this.pointLayer.clear();
			var that = this;
			dojo.forEach(this.config.layerIds, function(element, index) {
				var layer = that.map.getLayer(element);
				if(layer.isInstanceOf(FeatureLayer)) {
					layer.clearSelection();
				}
			});
			this.completed = 0;
		},
		/**
		 * Gets the correct symbol based on the layer, parent layer and type of
		 * geometry.
		 * 
		 * @private
		 * @instance
		 * @memberof tool.SelectionTool
		 * @param {String} type - The type of geometry
		 * @param {String} parentId
		 * @param {String|Integer} layerId
		 * @returns {Symbol} An Esri symbol json object.
		 */
		getSymbol : function(type, parentId, layerId) {
			if(this.config.layerSymbols[parentId]) {
				if(layerId) {
					this.config.layerSymbols[parentId][layerId];
				} else {
					return this.config.layerSymbols[parentId];
				}
			} else {
				switch(type) {
					case "esriGeometryPoint" :
						return this.config.pointSelectionSymbol;
						break;
					case "esriGeometryPolygon":
						return this.config.polySelectionSymbol;
						break;
					case "esriGeometryPolyline":
						return this.config.lineSelectionSymbol;
						break;
					default:
						return this.config.polySelectionSymbol;
						break;
				}
			}
		},

	    /**
		 * Generates a list element with a radiobutton for a given layer.
		 * 
		 * @instance
		 * @protected
		 * @memberof tool.LayerListTool
		 * @param {String} id - The layers id
		 * @param {String} name - The layers display name.
		 * @returns {Node} The dom element of the generated list element.
		 */
		constructListElement: function (id, name) {
		    var listItem = domConstruct.create("li");
		    var input = domConstruct.create("input", {
		        id: id,
		        type: "radio",
                        name: "layersList"
		    });
		    var label = domConstruct.create("label", {
		        for: id
		    });
		    label.innerHTML = name;
		    domConstruct.place(input, listItem, "first");
		    domConstruct.place(label, listItem, "last");
		    return listItem;
		},
	    /**
		 * Generates and binds an onclick handler to the checkbox input of a given layer list
		 * item. Fires an event containing the id and parent id of the layer and a boolean
		 * representing its visiblity.
		 * 
		 * @instance
		 * @protected
		 * @memberof tool.LayerListTool
		 * @param {Node} listElement - The list element's dome node.
		 * @param {String} id - The layer's id.
		 * @param {String|null} parentId - Id of the layer's parent layer (optional)
		 */
		bindToggleHandler: function (listElement, id, parentId) {
		    var that = this;
		    var input = dojo.query(' > input', listElement);
		    var fn = function (evt) {
		        that.toggleLayer({
		            id: id,
		            parentId: parentId,
		            visible: evt.toElement.checked,
                            layerList: that.layerManager.getLayerList()
		        });
		    };
		    this.handlers.push(on(input, "click", fn));
		},
	    /**
		 * Toggles a layers visibility. Has to handle toggling differently for
		 * feature and dynamic service layers.
		 * 
		 * @memberof tool.LayerListTool
		 * @instance
		 * @protected
		 * @param {Object} layerInfo - Info about the layer to toggle.
		 * @param {String} layerInfo.id - The id of the layer to toggle
		 * @param {String|null} layerInfo.parentId - The id of the layer's parent layer.
		 * @param {Boolean} layerInfo.visible - Whether or not the layer should be visible.
		 */
		toggleLayer: function (layerInfo) {
                    var that = this;
                    var aux;
                    dojo.forEach(layerInfo.layerList, function (layer, index) {
                        if (layer.id !== layerInfo.id) {
                            aux = that.map.getLayer(layer.id);
                            aux.setVisibility(false);
                        }
                    });		    
		    if (layerInfo.parentId) {
		        var layer = that.map.getLayer(layerInfo.parentId);
		        var visibleLayers = layer.visibleLayers;
		        if (layerInfo.visible) {
		            visibleLayers.push(layerInfo.id);
		        } else {
		            var index = visibleLayers.indexOf(layerInfo.id);
		            visibleLayers.splice(index, 1);
		        }
		        var parentIdElt = dojo.query('#' + layerInfo.parentId, this._layerList);
		        if (visibleLayers.length > 0) {
		            layer.setVisibility(true);
		            if (parentIdElt[0]) {
		                parentIdElt[0].checked = true;
		            }
		            layer.setVisibleLayers(visibleLayers);
		        } else {
		            layer.setVisibility(false);
		            if (parentIdElt[0]) {
		                parentIdElt[0].checked = false;
		            }
		        }
		    }
		    else {
		        var layer = that.map.getLayer(layerInfo.id);
		        layer.setVisibility(layerInfo.visible);
		        var visibleLayers = layer.visibleLayers;
		        var parent = dojo.query('#' + layerInfo.id, this._layerList).parent();
		        parent = parent[0];
		        dojo.forEach(visibleLayers, function (layer, index) {
		            var elt = dojo.query('#' + layer, parent);
		            elt[0].checked = layerInfo.visible;
		        });
		    }
		},
	    /**
		 * Injects the layer list into the panel node.
		 * 
		 * @memberof tool.LayerListTool
		 * @protected
		 * @param {Node} layerList - Dom node of the root of the layer list
		 */
		injectLayerList: function (layerList) {
		    var that = this;
		    this._layerList.innerHTML = "";
		    dojo.forEach(layerList, function (layer, index) {
		        if (that.config.exclude.indexOf(layer.id) === -1) {
		            var listItem = that.constructListElement(layer.id, layer.name, layer.visible);
		            that.bindToggleHandler(listItem, layer.id);
		            if (layer.layerInfos) {
		                var ul = domConstruct.create("ul");
		                for (var v = 0; v < layer.layerInfos.length; v++) {
		                    var subLayer = layer.layerInfos[v];
		                    var visible = layer.visibleLayers.indexOf(subLayer.id);
		                    var subItem = that.constructListElement(subLayer.id, subLayer.name, visible);
		                    domConstruct.place(subItem, ul);
		                    that.bindToggleHandler(subItem, subLayer.id, layer.id);
		                }
		                domConstruct.place(ul, listItem);
		            }
		            domConstruct.place(listItem, that._layerList);
		        }
		    });
		},
	    /**
		 * Triggers an update of the layer list dom elements. Reconstructs the list
		 * based on what layers are available according to the layer manager.
		 * 
		 * @protected
		 * @instance
		 * @memberof tool.LayerListTool
		 */
		updateLayerList: function () {
		    this.injectLayerList(this.layerManager.getLayerList());
		},
		/**
		 * Binds all the dom and map input handlers. Handlers for click events and
		 * drawing completion.
		 * 
		 * @memberof tool.SelectionTool
		 * @instance
		 * @protected
		 */
		bindHandlers : function() {
			var that = this;
			on(this._drawRect, 'click', function() {
				that.map.setInfoWindowOnClick(false);
				domClass.add(that._drawRect, "draw-tool-selected");
				domClass.remove(that._drawPoint, "draw-tool-selected");
				domClass.remove(that._drawLine, "draw-tool-selected");
				domClass.remove(that._drawPoly, "draw-tool-selected");
				that.drawToolbar.activate(Draw.EXTENT);
			});
			on(this._drawPoint, 'click', function() {
				that.map.setInfoWindowOnClick(false);
				domClass.remove(that._drawRect, "draw-tool-selected");
				domClass.add(that._drawPoint, "draw-tool-selected");
				domClass.remove(that._drawLine, "draw-tool-selected");
				domClass.remove(that._drawPoly, "draw-tool-selected");
				that.drawToolbar.activate(Draw.POINT);
			});
			on(this._drawLine, 'click', function() {
				that.map.setInfoWindowOnClick(false);
				domClass.remove(that._drawRect, "draw-tool-selected");
				domClass.remove(that._drawPoint, "draw-tool-selected");
				domClass.add(that._drawLine, "draw-tool-selected");
				domClass.remove(that._drawPoly, "draw-tool-selected");
				that.drawToolbar.activate(Draw.LINE);
			});
			on(this._drawPoly, 'click', function() {
				that.map.setInfoWindowOnClick(false);
				domClass.remove(that._drawRect, "draw-tool-selected");
				domClass.remove(that._drawPoint, "draw-tool-selected");
				domClass.remove(that._drawLine, "draw-tool-selected");
				domClass.add(that._drawPoly, "draw-tool-selected");
				that.drawToolbar.activate(Draw.POLYGON);
			});

			this.drawToolbar.on("DrawEnd", function(geometry) {
				that.map.setInfoWindowOnClick(true);
				var doBuffer = that._bufferToggle.checked || 
					geometry.type === "point" || geometry.type === "line";
				if(doBuffer) {
					that.doBuffer(geometry);
				} else {
					that.performQuery(geometry);
				}
				that.drawToolbar.deactivate();
			});

			this.layerManager.on("manager-add-layer", function () {
			    that.updateLayerList();
			});
		}
	});
});
