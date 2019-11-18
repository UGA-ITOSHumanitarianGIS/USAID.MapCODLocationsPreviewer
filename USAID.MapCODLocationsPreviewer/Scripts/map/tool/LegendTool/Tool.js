define([
	'dojo/_base/declare',
	'esri/dijit/Legend',
    '../base/BasePanelTool',
    'dijit/Tooltip',
    'dojo/domReady!'
], function(
	declare,
	Legend,
    BasePanelTool,
    Tooltip
){
	return declare([BasePanelTool], {
		name : "LegendTool",
		label: "Legend",
        hasMenu: true,
		/**
		 * Starts the Esri legend widget.
		 * 
		 * @protected
		 * @override
		 * @instance
		 * @memberof tool.LegendTool
		 */
		startup : function() {
			this.inherited(arguments);
			this.legend.startup();
		},
		/**
		 * Creates a new legend tool.
		 * @classdesc Provides the user a way to view all map symbology and its 
		 * meaning as defined on the server. The legend tool wraps the esri legend 
		 * widget and provides a panel to display it in. By default it enables 
		 * the legend on all layers.
		 * 
		 * @constructor LegendTool
		 * @memberof tool
		 * @extends tool.base.BasePanelTool
		 * @returns {LegendTool} The new legend tool.
		 */
		constructor : function() {
		},
		/**
		 * Sets up the Esri Legend digit.
		 * 
		 * @protected
		 * @memberof tool.LegendTool
		 * @instance
		 * @override
		 */
		postCreate : function() {
			this.inherited(arguments);
			var that = this;
			this.legend = new Legend({
				map : that.map
			}, this._legend);
			this.layerManager.on("layer-visibility-changed",function(data) {
				that.legend.refresh();
            });
         
		},
		onShow : function() {
			this.legend.refresh();
		},
		onHide : function() {
			this.legend.refresh();
		}

	});
});

