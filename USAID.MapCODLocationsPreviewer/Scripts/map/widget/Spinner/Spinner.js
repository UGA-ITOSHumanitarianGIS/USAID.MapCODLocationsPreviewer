/**
 * A set of widgets that are used by the dawgmap core and base tools. 
 * 
 * @namespace widget
 * @instance
 */
define([
	'dojo/Evented',
	'dojo/_base/declare',
	'dojo/dom-construct',
	'dojo/dom-class',
	'dojo/dom-style',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'../../mixin/ShowHideMixin',
	'dojo/text!./Spinner.html',
	'require',
	'xstyle/css!./Spinner.css'
], function(
	Evented, 
	declare, 
	domConstruct, 
	domClass, 
	domStyle,
	_WidgetBase, 
	_TemplatedMixin, 
	ShowHideMixin,
	template, 
	require
) {
	return declare([_WidgetBase, _TemplatedMixin, Evented, ShowHideMixin], {
		/**
		 * HTML template for the widget. See the [templated widget documentation]{@link https://dojotoolkit.org/documentation/tutorials/1.10/templated/index.html}
		 * for more information. 
		 * 
		 * @name widget.Spinner#template
		 * @type String
		 * @private
		 */
		templateString: template,
		/**
		 * The message to be displayed along with the loading spinner.
		 * 
		 * @name widget.Spinner#message
		 * @type String
		 * @private
		 */
		message : "",
		/**
		 * Widget configuration object
		 * 
		 * @type Object
		 * @private
		 * @name widget.Spinner#config
		 */
		config : {
			message : ""
		},
		/**
		 * Widget post create function, called after construction, sets spinner
		 * image url.
		 * 
		 * @instance
		 * @memberof widget.Spinner#config
		 */
		postCreate: function() {
			this.inherited(arguments);
			domStyle.set(this._image, "background-image", "url(\'"+require.toUrl("./img/loading.gif")+"\')")
			domClass.add(this.domNode, "no-display");
		},
		/**
		 * 
		 * Creates a new spinner.
		 * 
		 * @classdesc A widget for displaying a loading message and an animated
		 * image to indicate that the map is loading or drawing.
		 * 
		 * @constructor Spinner
		 * @memberof widget
		 * @param {Object} config - Config object for the spinner.
		 * @param {String} config.message - The message to display along with the graphic
		 * @returns {Spinner} the new spinner object.
		 */
		constructor : function(config) {
			declare.safeMixin(this.config, config);
			this.message = this.config.message;
            this.domNode = domConstruct.create("div", {innerHTML:this.templateString});
		},
		/**
		 * Injects the message into the container and displays the spinner.
		 * 
		 * @instance
		 * @memberof widget.Spinner
		 * @private
		 * @param {String} message - The message to display
		 */
		showWithMessage: function(message) {
			if(message) {
				this.set("message", message);
			}
			this._message.innerHTML = this.message;
			
			domClass.remove(this.domNode, "no-display");
			this.show();
		}
	});
});