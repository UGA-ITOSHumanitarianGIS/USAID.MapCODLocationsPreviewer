

define([
	'dojo/Evented',
	'dojo/_base/declare',
	'dojo/dom-construct',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'../../mixin/ShowHideMixin',
	'dojo/text!./Toolbar.html',
	'xstyle/css!./Toolbar.css'
], function (
	Evented,
	declare,
	domConstruct,
	_WidgetBase,
	_TemplatedMixin,
	ShowHideMixin,
	dijitTemplate
) {
	return declare([Evented, _WidgetBase, _TemplatedMixin, ShowHideMixin], {
		/**
		 * HTML template for the widget. See the [templated widget documentation]{@link https://dojotoolkit.org/documentation/tutorials/1.10/templated/index.html}
		 * for more information. 
		 * 
		 * @name widget.Toolbar#template
		 * @type String
		 * @private
		 */
		templateString : dijitTemplate,
		/**
		 * An object containing ToolbarButtons that are keyed by the tool name
		 * of the tool to which the correspond.
		 * 
		 * @type Object
		 * @name widget.Toolbar#icons
		 * @private
		 */
		icons : {},
		/**
		 * CSS class names for the template.
		 * 
		 * @private
		 * @name widget.Toolbar#_css
		 * @type Object
		 */
		_css: {
			toolbarContainer: "toolbarContainer",
			titleContainer: "titleContainer",
			titleNode: "titleNode",
			iconContainer: "iconContainer"
		},
		/*
		 * Creates a new toolbar widget.
		 * 
		* @classdesc Container widget for all plugin toolbar icons. Basically just a div with some
		* show/hide functionality.
		* @constructor Toolbar
		* @memberof widget
		* @extends _WidgetBase
		* @param {Object} options - Widget configuration object
		* @returns {Toolbar} The toolbar widget.
		*/
		constructor : function(options) {
			declare.safeMixin(this.options, options);
            this.domNode = domConstruct.create("div", {innerHTML:this.templateString});
		},
		/**
		 * Event handler, sets the content of the template node "_titleNode" whenever
		 * the this.set method is used to change the toolbar's title. 
		 * See [mapping widget attributes to dom nodes]{@link http://dojotoolkit.org/reference-guide/1.10/quickstart/writingWidgets.html#mapping-widget-attributes-to-domnode-attributes}
		 * for more information.
		 * 
		 * @private
		 * @memberof widget.Toolbar
		 * @instance
		 */
		_setTitleAttr: {
			node: "_titleNode", 
			type: "innerHTML"
		},
		/**
		 * Places ToolbarButton widgets in the container div and then starts them.
		 * 
		 * @param {ToolbarButton} toolbarIcon - The ToolbarButton to place.
		 * @public
		 * @instance
		 * @memberof widget.Toolbar
		 */
		placeIcon: function (toolbarIcon) {
			this.icons[toolbarIcon.toolName] = toolbarIcon;
			toolbarIcon.placeAt(this._iconContainer);
			toolbarIcon.startup();
		},
		/**
		 * Fetches a toolbar button based on the name of the tool.
		 * @memberof widget.Toolbar
		 * @instance
		 * @public
		 * @param {String} toolName - The name of the tool
		 * @returns {Tool|null} The tool fetched or null if no such tool exists
		 */
		getIcon: function(toolName) {
			if(this.icons[toolName]) {
				return this.icons[toolName];
			} else {
				return null;
			}
		}
	});
});

