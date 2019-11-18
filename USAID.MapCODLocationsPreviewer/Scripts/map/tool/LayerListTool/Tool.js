define([
	'dojo/_base/declare',
	'dojo/dom-construct',
	"dojo/on",
	'../base/BasePanelTool',
	'dojo/NodeList-traverse'
],
function(
	declare, 
	domConstruct, 
	on,
	BasePanelTool
) {
	return declare([BasePanelTool],{
		name : "LayerListTool",
		label : "Layer List",
		/**
		 * Array of event handler references, needed to remove event handlers after
		 * binding.
		 * 
		 * @private
		 * @name tool.LayerListTool#handlers
		 * @type Array
		 */
		handlers : [],
		/**
		 * Object containing the class names of dom nodes that exist in the template.
		 * 
		 * @type Object
		 * @name tool.LayerListTool#_css
		 * @protected
		 */
		_css : {
			container : "layer-list-container",
			list : "layer-list"
		},
		/**
		 * The default configuration for the tool.
		 * 
		 * @type Object
		 * @name tool.LayerListTool#config
		 * @public
		 */
		config : {
			exclude : []
		},
		/**
		 * Creates a new LayerListTool.
		 * 
		 * @classdesc The layer list provides a widget for users to select which layers that
		 * have been added to the map are visible. Exposes all feature and dynamic 
		 * service layers in an unordered list with checkboxes next to each one.
		 * Queries the layer manager to retrieve list of valid layers.
		 * 
		 * @constructor LayerListTool
		 * @memberof tool
		 * @extends tool.base.BasePanelTool
		 * @param {Object} config - The tool configuration object.
		 * @param {Array} config.exclude - A list of layer ids to exclude from the list.
		 * @returns {LayerListTool} The layer list tool.
		 */
		constructor : function(config) {
		},
		/**
		 * Sets up event handlers and injects the list elements
		 * into the dom. Part of the dojo widget lifecycle. Called by the tool 
		 * manager after map and all layers have been loaded.
		 * 
		 * @public 
		 * @instance
		 * @memberof tool.LayerListTool
		 */
		startup : function() {
			this.inherited(arguments);
			this.bindHandlers();
			this.injectLayerList(this.layerManager.getLayerList());
                        //console.log(this.layerManager.getLayerList());
		},
		/**
		 * Generates a list element with a checkbox for a given layer.
		 * 
		 * @instance
		 * @protected
		 * @memberof tool.LayerListTool
		 * @param {String} id - The layers id
		 * @param {String} name - The layers display name.
		 * @param {Boolean} visible - Whether the layer is currently visible.
		 * @returns {Node} The dom element of the generated list element.
		 */
		constructListElement : function(id, name, visible) {
			var listItem = domConstruct.create("li");
			var input = domConstruct.create("input", { 
				id : id, 
				type : "checkbox", 
				checked : visible
			});
			var label = domConstruct.create("label", {
				for : id
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
		bindToggleHandler : function(listElement, id, parentId) {
			var that = this;
			var input = dojo.query(' > input', listElement);
			var fn = function(evt) {
				that.toggleLayer({
					id : id,
					parentId : parentId,
					visible : evt.toElement.checked
				});
			};
			this.handlers.push(on(input,"click", fn));
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
		toggleLayer : function(layerInfo) {
			var that = this;
			if(layerInfo.parentId) {
				var layer = that.map.getLayer(layerInfo.parentId);
				var visibleLayers = layer.visibleLayers;
				if(layerInfo.visible) {
					visibleLayers.push(layerInfo.id);
				} else {
					var index = visibleLayers.indexOf(layerInfo.id);
					visibleLayers.splice(index, 1);
				}
				var parentIdElt = dojo.query('#'+layerInfo.parentId, this._layerList);
				if(visibleLayers.length > 0) {
					layer.setVisibility(true);
					if(parentIdElt[0]) {
						parentIdElt[0].checked = true;
					}
					layer.setVisibleLayers(visibleLayers);
				} else {
					layer.setVisibility(false);
					if(parentIdElt[0]) {
						parentIdElt[0].checked = false;
					}
				}
			}
			else {
				var layer = that.map.getLayer(layerInfo.id);
				layer.setVisibility(layerInfo.visible);
				var visibleLayers = layer.visibleLayers;
				var parent = dojo.query('#'+layerInfo.id, this._layerList).parent();
				parent = parent[0];
				dojo.forEach(visibleLayers, function(layer, index){
					var elt = dojo.query('#'+layer, parent);
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
		injectLayerList : function(layerList) {
			var that = this;
			this._layerList.innerHTML = "";
			dojo.forEach(layerList, function(layer,index) {
				if(that.config.exclude.indexOf(layer.id) === -1) {
					var listItem = that.constructListElement(layer.id, layer.name, layer.visible);
					that.bindToggleHandler(listItem, layer.id);
					if(layer.layerInfos) {
						var ul = domConstruct.create("ul");
						for(var v = 0; v < layer.layerInfos.length; v++) {
                                                        var visible = false;
							var subLayer = layer.layerInfos[v];
                                                        if (layer.indivLayersVisible !== undefined)
                                                        {
                                                            if (JSON.stringify(layer.indivLayersVisible).indexOf(subLayer.id) > -1) { visible = true; };
                                                        } else 
                                                        {
                                                            if (JSON.stringify(layer.visibleLayers).indexOf(subLayer.id) > -1) { visible = true; };
                                                        }
                                                        
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
		updateLayerList : function() {
			this.injectLayerList(this.layerManager.getLayerList());
		},
		/**
		 * Binds event handler to update the layer list any time a new layer is
		 * added to the layer manager. 
		 * 
		 * @protected
		 * @instance
		 * @memberof tool.LayerListTool
		 */
		bindHandlers : function() {
			var that = this;
			this.layerManager.on("manager-add-layer", function() {
				that.updateLayerList();
            });
            this.layerManager.on("manager-remove-layer", function () {
                that.updateLayerList();
            });
		}
	});
});


