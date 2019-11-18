define([
	'dojo/Evented',
	'dojo/_base/declare'
], function(Evented, declare){
	return declare([Evented], {
                map : null,
		/**
		 * An array of tool information collected prior to loading. 
		 * 
		 * @private
		 * @name core.ToolManager#toolInfos
		 * @type Array
		 */
		snippetInfos : [],
                /**
		 * An array of tools that have already been loaded.
		 * 
		 * @private
		 * @name core.ToolManager#toolsLoaded
		 * @type Array
		 */
		snippetsLoaded : [],
		/**
		 * Toolbar button objects array.
		 * 
		 * @name core.ToolManager#buttons
		 * @type Array
		 * @private
		 */
		loaded : 0,
		/**
		 * Creates a new tool manager.
		 * 
		 * @classdesc Core tool manager, handles the setup and asyncronous loading of DawgMap
		 * Tools. Creates ToolbarButtons and places them in the toolbar.
		 *
		 * @memberof core
		 * @constructor ToolManager
		 * @param {Object} map - A reference to the map.
		 */
		constructor : function(map) {
                    this.map = map;
		},
		/**
		 * Add a tool to the tool manager, load toolbar icon image, load tool HTML
		 * template, and place the ToolbarButton in the Toolbar.
		 * 
		 * @instance
		 * @public
		 * @memberof snippet.SnippetManager
		 * @param {Snippet|String} snippet - Either a snippet, or a namespace where a snippet can be located by the dojo amd loader.
		 * @param {Object} config - The snippet specific configuration.
		 */
		add : function(snippet, config) {
			var snippetNameSpaceParts = snippet.split("/");
			this.snippetInfos.push({
				snippetName : snippetNameSpaceParts[snippetNameSpaceParts-1],
				snippetNameSpace : snippet+"/Snippet",
				config : config
			});
                        this._load(this.snippetInfos[this.snippetInfos.length-1]);
                        
		},
                /**
		 * Loads a tool asyncronously and fires an event when all tools have finished
		 * loading.
		 * 
		 * @memberof core.Toolmanager
		 * @protected
		 * @instance
		 * @param {Object} snippetInfo - Object containing snippet info
		 */
		_load : function(snippetInfo) {
			var that = this;
			require([
				snippetInfo.snippetNameSpace],
			function(snippetObj){
				var newSnippet = that.addFromNameSpace(snippetObj, snippetInfo.config);
                                that.snippetsLoaded.push(newSnippet);
				that.loaded++;
				if(that.loaded === that.snippetInfos.length) {
					that.emit("snippets-loaded", {});
				}
			});
		},
                /**
		 * Sets up a tool object using its config and its HTML template.
		 * 
		 * @instance
		 * @private
		 * @memberof core.ToolManager
		 * @param {Snippet} snippetObj
		 * @param {Object} config - Snippet config
		 * @returns {Snippet} An instantiated snippet object
		 */
		addFromNameSpace : function(snippetObj, config) {
			config = config || {};
			var snippet = new snippetObj(this.map, config);
			return snippet;
		},
                /**
		 * Returns a tool by its name.
		 * @param {type} snippetName - The snippet name.
		 * @returns {Snippet} The snippet.
		 */
		get : function(snippetName) {
			for(var i = 0; i < this.snippetsLoaded.length; i++) {
				if(this.snippetsLoaded[i].name === snippetName) {
					return this.snippetsLoaded[i];
				}
			}
		}
	});
});