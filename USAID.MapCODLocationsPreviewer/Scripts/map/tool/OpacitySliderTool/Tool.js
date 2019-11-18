define([
	'dojo/_base/declare',
        'dojo/dom',
	'dojo/dom-construct',
        'dijit/form/HorizontalSlider',
        'dijit/form/HorizontalRule',
        'dijit/form/HorizontalRuleLabels',
	'dojo/on',
	'../base/BasePanelTool',
	'dojo/NodeList-traverse'
],
function(
	declare, 
        dom,
	domConstruct, 
        HorizontalSlider,
        HorizontalRule,
        HorizontalRuleLabels,
	on,
	BasePanelTool
) {
	return declare([BasePanelTool],{
		name : "OpacitySliderTool",
		label : "Layer List",
                hasMenu : true,
                slidersInjected : false,
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
			container : "opacity-slider-list-container",
			list : "opacity-slider-list"
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
		 * Deactivates any drawing whenever the tool's panel is hidden.
		 * 
		 * @override
		 * @instance
		 * @protected
		 * @memberof tool.SelectionTool
		 */
		onHide : function() {
		},
        onShow: function () {
			if (!this.slidersInjected) { 
                            this.bindHandlers();
                            this.injectLayerList(this.layerManager.getLayerList());
                            this.injectSliders(this.layerManager.getLayerList());
                            this.slidersInjected = true;
                        } else
                            this.slidersInjected = false;
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
			var listItem = domConstruct.create("li", {
                            'class' : 'layerLi'
                        });                   
			var input = domConstruct.create("input", { 
				'class' : 'checkBoxDiv',
                                id : id, 
				type : "checkbox", 
				checked : visible
			});
                        var sliderDiv = domConstruct.create("div", {
                                id : id + "Slider"
                        });
			var label = domConstruct.create("label", {
				'class' : 'labelDiv',
                                'for' : id
			});	
			label.innerHTML = name;
			domConstruct.place(input, listItem, "first");
                        domConstruct.place(sliderDiv, input, "after");
                        domConstruct.place(label, listItem, "last");
			return listItem;
		},
                
                constructSubListElement : function(id, name, visible) {
			var listItem = domConstruct.create("li", {
                            'class' : 'sublayerDiv'
                        });                   
			var input = domConstruct.create("input", { 
				id : id, 
				type : "checkbox", 
				checked : visible
			});
			var label = domConstruct.create("label", {
				'for' : id
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
		bindToggleHandler : function(listElement, id, parentId, subLayerIds) {
			var that = this;
			var input = dojo.query(' > input', listElement);

			var fn = function (evt) {
			    var elem = evt.target || evt.srcElement; //4IE
			    if (elem == undefined)
			        elem = evt.toElement;
				that.toggleLayer({
					id : id,
					parentId : parentId,
					visible : elem.checked,
                                        subLayerIds: subLayerIds
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
                        var parentIdEltSub = null;
			if(layerInfo.parentId != null) {
                            var layer = that.map.getLayer(layerInfo.parentId[0]);
                            var visibleLayers = [];
                            var parentIdEltGroup = [];
                            if(layer != undefined)
                            {
                                visibleLayers = layer.visibleLayers;      
                                if(layerInfo.visible) {
                                    if(layerInfo.subLayerIds != undefined)
                                    {
                                        for (var z = 0; z <= layerInfo.subLayerIds.length; z++)
                                        {
                                            visibleLayers.push(layerInfo.subLayerIds[z]);
                                            parentIdEltGroup.push(dojo.query('#' + layerInfo.parentId[0] + '_' + layerInfo.subLayerIds[z] , that._opacitySliderList));
                                        }    
                                    }
                                    visibleLayers.push(layerInfo.id);

                                } else {
                                        if(layerInfo.subLayerIds != undefined)
                                        {
                                            for (var z = 0; z <= layerInfo.subLayerIds.length; z++)
                                            {
                                                visibleLayers.splice(layerInfo.subLayerIds[z]);
                                                parentIdEltGroup.push(dojo.query('#' + layerInfo.parentId[0] + '_' + layerInfo.subLayerIds[z] , that._opacitySliderList));
                                            }    
                                        }
                                        var index = visibleLayers.indexOf(layerInfo.id);
                                        visibleLayers.splice(index, 1);
                                }
                            }
                            var parentIdElt = dojo.query('#'+layerInfo.parentId[0], that._opacitySliderList);
                            if (layerInfo.parentId[1] != undefined)
                                parentIdEltSub = dojo.query('#' + layerInfo.parentId[0] + '_' + layerInfo.parentId[1] , that._opacitySliderList);
                            if(typeof visibleLayers !== 'undefined' && visibleLayers != null){
                                if (visibleLayers.length > 0) {
                                    if (layer != undefined)
                                    {
                                        layer.setVisibility(true);
                                        layer.setVisibleLayers(visibleLayers);
                                    }

                                    if(parentIdElt[0]) 
                                            parentIdElt[0].checked = true; 
                                    if(parentIdEltSub)
                                    {
                                        if(parentIdEltSub[0])
                                            parentIdEltSub[0].checked = true;
                                    }
                                    for(var e = 0; e <= parentIdEltGroup.length; e++)
                                    {
                                        var selector = parentIdEltGroup[e];
                                        if(selector)
                                            if(selector[0])
                                                selector[0].checked = true;
                                    }
                                } else {
                                    if (layer != undefined)
                                        layer.setVisibility(false);
                                    if(parentIdElt[0]) 
                                        parentIdElt[0].checked = false;
                                    if(parentIdEltSub)
                                    {
                                        if(parentIdEltSub[0])
                                            parentIdEltSub[0].checked = false;
                                    }
                                    for(var e = 0; e <= parentIdEltGroup.length; e++)
                                    {
                                        var selector = parentIdEltGroup[e];
                                        if(selector)
                                            if(selector[0])
                                                selector[0].checked = false;
                                    }
                                }
                            }
                    } else {
                            var layer = that.map.getLayer(layerInfo.id);
                            layer.setVisibility(layerInfo.visible);
                            var visibleLayers = layer.visibleLayers;
                            if (visibleLayers == undefined)
                                visibleLayers = [];
                            var parent = dojo.query('#'+layerInfo.id, that._opacityLayerList).parent();
                            parent = parent[0];
                            dojo.forEach(visibleLayers, function(layer, index){
                                    var elt = dojo.query('#'+layer, parent);
                                    elt[0].checked = layerInfo.visible;
                            });
                    }
		},
                /**
		 * Injects the sliders into the panel node.
		 * 
		 * @memberof tool.OpacitySliderTool
		 * @protected
		 * @param {Node} layerList - Dom node of the root of the layer list
		 */
		injectSliders : function(layerList) {
			var that = this;
                        var slider;
                        var sliderNode;
                        var ruler;
                        var rulerNode;
                        var labelsNode;
                        var labels;
			dojo.forEach(layerList, function(layer) {
				if(that.config.exclude.indexOf(layer.id) === -1) {
                                        sliderNode = dom.byId(layer.id + "Slider");
                                        rulerNode = domConstruct.create("div", {}, sliderNode, "first");
                                        ruler = new HorizontalRule({
                                            container: "topDecoration",
                                            count: 3,
                                            style: "height: 3px;"
                                        }, rulerNode);
                                        labelsNode = dojo.create("div", {}, sliderNode, "first");
//                                        labels = new HorizontalRuleLabels({
//                                            container: "bottomDecoration",
//                                            labelStyle: "font-style: italic; font-size: 0.75em"
//                                        }, labelsNode);
                                        slider = new HorizontalSlider({
                                            'class': 'sliderDiv',
                                            name: layer.id,
                                            value: 1,
                                            minimum: 0,
                                            maximum: 1,
                                            intermediateChanges: true,
                                            style: "width:85px;",
                                            showButtons: false,
                                            onChange: function(value){
                                                var layer = that.map.getLayer(this.name);
                                                layer.setOpacity(value);
                                            }
                                        }, sliderNode);
                                        slider.startup();
                                        ruler.startup();
//                                        labels.startup();
				}
            });
            this.slidersInjected = true;
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
                        var parentLayer = [];
			this._opacitySliderList.innerHTML = "";
			dojo.forEach(layerList, function(layer,index) {
				if(that.config.exclude.indexOf(layer.id) === -1) {
                                    var subLayerIds;
                                    var listItem = that.constructListElement(layer.id, layer.name, layer.visible);
                                    var ul = domConstruct.create("ul");
                                    domConstruct.place(ul, listItem);
                                    domConstruct.place(listItem, that._opacitySliderList);
                                    that.bindToggleHandler(listItem, layer.id);
                                    if(layer.layerInfos) {
                                        var w = 0; //group layer sublayer counter
                                        var sLC = 0 //child of group subLayer counter
                                        var childGroup = false;
                                        var groupLayerId;
                                        for(var v = 0; v < layer.layerInfos.length; v++) {
                                            subLayerIds = [];
                                            var visible = false;
                                            var ulParent = domConstruct.create("ul");
                                            var ul2 = null;
                                            domConstruct.place(ulParent, ul);
                                            var subLayer = layer.layerInfos[v];
                                            //parentLayer = layer;
                                            if (layer.indivLayersVisible !== undefined)
                                            {
                                                if (JSON.stringify(layer.indivLayersVisible).indexOf(subLayer.id) > -1) { visible = true; };
                                            } else 
                                            {
                                                if (JSON.stringify(layer.visibleLayers).indexOf(subLayer.id) > -1) { visible = true; };
                                            }
                                            var subItem = that.constructSubListElement(layer.id + '_' + subLayer.id, subLayer.name, visible);
                                            parentLayer = [layer.id];
                                            if (subLayer.subLayerIds != null) {
                                                //for (var y = 0; y < subLayer.subLayerIds.length; y++)
                                                //{
                                                    subLayerIds = subLayer.subLayerIds;
                                                //}
                                              w = 0;
                                              childGroup = true;
                                              groupLayerId = subLayer.id;
                                              sLC = subLayer.subLayerIds.length;
                                              domConstruct.place(subItem, ulParent);
                                              that.bindToggleHandler(subItem, v, parentLayer, subLayerIds); 
                                            } else {
                                                if (childGroup) {
                                                  parentLayer = [layer.id, groupLayerId];
                                                  w++;
                                                  ul2 = domConstruct.create("ul");
                                                  domConstruct.place(ul2, ulParent);
                                                  domConstruct.place(subItem, ul2);
                                                } else {
                                                  domConstruct.place(subItem, ulParent);
                                                }
                                            }

                                            if (w > sLC) {
                                              childGroup = false;
                                              domConstruct.place(subItem, ulParent);
                                              w = 0;
                                              sLC = 0;
                                              parentLayer = [layer.id];
                                            }
                                            if (subLayerIds.length == 0)
                                                that.bindToggleHandler(subItem, v, parentLayer); 
                                            }

                                        }
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
		}
	});
});


