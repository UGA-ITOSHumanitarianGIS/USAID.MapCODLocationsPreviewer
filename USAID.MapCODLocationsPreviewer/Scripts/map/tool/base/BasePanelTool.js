/**
 * A set of base tool classes for extending.
 * 
 * @namespace tool.base
 * @memberof tool
 * @instance
 */
define([
	'dojo',
	'dojo/Evented',
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/dom-construct',
	'dojo/dom-class',
	'dojo/dnd/Moveable',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'../../mixin/ShowHideMixin',
	'dojo/parser',
	'dojo/text!./BasePanelTool.html',
	'xstyle/css!./BasePanelTool.css'
], function(
	dojo,
	Evented,
	declare,
	lang,
	domConstruct,
	domClass,
	Moveable,
	_WidgetBase,
	_TemplatedMixin,
	ShowHideMixin,
	parser,
	dijitTemplate
) {
	return declare([Evented,_WidgetBase,_TemplatedMixin,ShowHideMixin],{
		/**
		 * The name of the class, must be set to the name of the main tool folder
		 * in all subclasses.
		 * 
		 * @protected
		 * @name tool.base.BasePanelTool#name
		 * @type String
		 */
		name : "",
		/**
		 * The string to inject into the panel's title container.
		 * 
		 * @protected
		 * @name tool.base.BasePanelTool#label
		 * @type String
		 */
		label : "",
		/**
		 * A reference to the app's tool manager.
		 * 
		 * @protected
		 * @name tool.base.BasePanelTool#toolManager
		 * @type core.ToolManager
		 */
		toolManager : null,
		/**
		 * A reference to the app's layer manager.
		 * 
		 * @protected
		 * @name tool.base.BasePanelTool#layerManager
		 * @type core.LayerManager
		 */
		layerManager : null,
		/**
		 * A reference to the app's map
		 * 
		 * @protected
		 * @name tool.base.BasePanelTool#map
		 * @type esri.Map
		 */
		map : null,
		/**
		 * The template string to the BasePanelTool class.
		 * 
		 * @private
		 * @name tool.base.BasePanelTool#templateString
		 * @type String
		 */
		templateString : dijitTemplate,
		/**
		 * Dojo widget setting. Tells dojo that there are widgets in the template
		 * that need to be parsed. Should always be true generally speaking.
		 * 
		 * @name tool.base.BasePanelTool#widgetsInTemplate
		 * @private
		 * @type Boolean
		 */
		widgetsInTemplate : true,
		/**
		 * Config option defaults
		 * 
		 * @protected
		 * @name tool.base.BasePanelTool#config
		 * @type Object
		 */
		config : {
			toolManager : null,
			map : null,
			template : null,
			layerManager : null,
			widgetsInTemplate : false
		},
		/**
		 * Creates a new BasePanelTool.
		 * 
		 * @classdesc
		 * A panel tool is a piece of functionality that is tied to both a toolbar
		 * button as well as a panel, which is a draggable window that exists on
		 * the map surface. This is the base panel tool, and does all the heavy
		 * lifting for binding the necessary event handlers and injecting dom elements.
		 * The constructor takes care of parsing the template and injecting into the dom.
		 * 
		 * @memberof tool
		 * @constructor BasePanelTool
		 * @param {Object} config - Tool specific config
		 * @param {Object} config.map - A reference to the Esri map
		 * @param {LayerManager} config.layerManager - A reference to the layer manager
		 * @param {ToolManager} config.toolManager - A reference to the toolManager
		 * @param {String} config.template - An html string that will be parsed and inserted into the panel container.
		 * @returns {BasePanelTool} The new BasePanelTool
		 */
		constructor : function(config) {
			declare.safeMixin(this.config, config);
			this.map = this.config.map;
			this.layerManager = this.config.layerManager;
			this.toolManager = this.config.toolManager;
			this.widgetsInTemplate = this.config.widgetsInTemplate;
			if(this.config.template) {
				this.domNode = domConstruct.create("div", {innerHTML:config.template});
				this.templateString = lang.replace(this.templateString,{
					toolContent : config.template
				},
				/\%\[([^\]]+)\]/g
				);
			}
		},
		/**
		 * Initialization function that gets called after the map is ready.
		 * This is typically where stuff like event binding goes, make sure you
		 * call `this.inherited(arguments)` when overriding. Creates the panel
		 * and makes it moveable, the parses the template.
		 * 
		 * @public
		 * @instance
		 * @memberof tool.base.BasePanelTool
		 * @returns {undefined}
		 */
		startup: function() {
			this.moveable = new Moveable(this.domNode, {
				handle : this._handle,
				skip : true
			});
			parser.parse();
		},
		/**
		 * Convenience function for cross tool communcation. Fetches data from the
		 * specified tool. {@link core.ToolManager#fetchData}
		 * 
		 * @public
		 * @instance
		 * @memberof tool.base.BasePanelTool
		 * @param {type} toolName - The tool to fetch data from
		 * @returns {Object} Public data provided by the tool
		 */
		fetchData : function(toolName) {
			if(this.toolManager){
				return this.toolManger.fetchData(toolName);
			} else {
				throw "Error: tool manager not initialized.";
			}
		},
		/**
		 * Function that makes public data from a tool available to other tools.
		 * This is what is returned by `fetchData`. Implement a function in subclasses
		 * called `OnPublish` to utilize. {@link core.ToolManager#fetchData}
		 * 
		 * @instance
		 * @public
		 * @memberof tool.base.BasePanelTool
		 * @returns {Object}
		 */
		publish : function() {
			if(this.OnPublish) {
				return this.OnPublish();
			}
		},
		/**
		 * Function to publish a generic dataset to other interested classes. See {@link core.ToolManager#fetchData}
		 * 
		 * @abstract 
		 * @instance
		 * @memberof tool.base.BasePanelTool
		 * @returns {Object} Generic dataset that can be used by other tools.
		 */
		OnPublish : function() {
		}
	});
});