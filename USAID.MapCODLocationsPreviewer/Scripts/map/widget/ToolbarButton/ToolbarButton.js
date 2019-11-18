define([
	'dojo/Evented',
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dijit/_WidgetBase',
	'dijit/_OnDijitClickMixin',
	'dijit/_TemplatedMixin',
	'dojo/on',
	'dojo/text!./ToolbarButton.html',
	'dojo/dom-class',
	'dojo/dom-style',
	'dojo/dom-construct',
	'xstyle/css!./ToolbarButton.css'
], function (
	Evented,
	declare,
	lang,
	_WidgetBase,
	_OnDijitClickMixin,
	_TemplatedMixin,
	on,
	dijitTemplate,
	domClass,
	domStyle,
	domConstruct
) {
	return declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin, Evented], {
		/**
		 * HTML template for the widget. See the [templated widget documentation]{@link https://dojotoolkit.org/documentation/tutorials/1.10/templated/index.html}
		 * for more information. 
		 * 
		 * @name widget.ToolbarButton#template
		 * @type String
		 * @private
		 */
		templateString: dijitTemplate,
		/*
		 * Whether the tool panel is showing or not.
		 * 
		 * @name widget.ToolbarButton#state
		 * @private
		 * @type Boolean
		 */
		state: false,
		/**
		 * Name of the tool to which this toolbar button corresponds.
		 * 
		 * @type String
		 * @private
		 * @name widget.ToolbarButton#toolName
		 */
		toolName: null,
		/**
		 * Whether the toolbar button is highlighted when the panel is active.
		 * 
		 * @type Boolean
		 * @private
		 * @name widget.ToolbarButton#highlightable
		 */
		highlightable : true,
		/**
		 * The URL to the tool image.
		 * 
		 * @type String
		 * @private
		 * @name widget.ToolbarButton#imageURL
		 */
		imageURL : "",
		/**
		 * The CSS classes of the ToolbarButton's template.
		 * 
		 * @name widget.ToolbarButton#imageURL
		 * @private
		 * @memberof widget.ToolbarButton#_css
		 * @type Object
		 */
        _css: {},
        /**
		 * The tooltip label for the icon
		 * 
		 * @type String
		 * @private
		 * @name widget.ToolbarButton#toolLabel
		 */

        toolLabel: "",
        /*
		
		 * Creates a new toolbar button object.
		 * 
		 * @classdesc A toolbar button is a clickable icon that represents a tool
		 * within dawgmap. Usually shows or hides a tool's panel. 
		 * @constructor ToolbarButton
		 * @memberof widget
		 * @extends _WidgetBase
		 * @param {Object} config - Widget's config options
		 * @returns {ToolbarButton} - The new toolbar button
		 */
		constructor: function (config) {
			this.set('toolName', config.toolName);
			this._css = {
                toolName: config.toolName,
                toolLabel: config.toolLabel,
				container: "toolbarButtonContainer",
				button: "toolbarButton"
			};
			this.domNode = domConstruct.create("div", {innerHTML : this.templateString});
		},
		/**
		 * Sets the image of the toolbar button.
		 * 
		 * @instance
		 * @override
		 * @memberof widget.ToolbarButton
		 * @public
		 */
		startup : function() {
			domStyle.set(this._buttonNode, "background-image", "url(\""+this.imageURL+"\")");
			domStyle.set(this._buttonNode, "background-repeat", "no-repeat");	
			domStyle.set(this._buttonNode, "background-size", "contain");
		},
		/**
		 * Highlights the toolbar button.
		 * 
		 * @public
		 * @instance
		 * @memberof widget.ToolbarButton
		 */
		highlight : function() {
			if(this.state) {
				domClass.add(this._toolContainer, "tool-selected");
			} else {
				domClass.remove(this._toolContainer, "tool-selected");
			}
		},
		/**
		 * Toggles the state of the toolbar button, called when click event is fired
		 * on the button. Emits a toggle event that interested parties can bind to.
		 * 
		 * @private
		 * @instance
		 * @memberof widget.ToolbarButton
		 * @param {Event} event
		 */
		toggle: function (event) {
			this._set('state', !this.get('state'));
			this.emit('toggle', {toolName: this.toolName, state: this.get('state')});
		}
	});
});
