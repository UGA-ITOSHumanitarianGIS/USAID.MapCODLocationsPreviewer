define([
	'dojo/Evented',
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/dom-construct',
	'../tool/base/BasePanelTool',
    '../widget/ToolbarButton/ToolbarButton',
    'dijit/Tooltip'
], function(Evented, declare, lang, domConstruct,BasePanelTool,ToolbarButton,Tooltip){
	return declare([Evented], {
		/**
		 * An array of tool information collected prior to loading. 
		 * 
		 * @private
		 * @name core.ToolManager#toolInfos
		 * @type Array
		 */
		toolInfos : [],
		/**
		 * An array of tools that have already been loaded.
		 * 
		 * @private
		 * @name core.ToolManager#toolsLoaded
		 * @type Array
		 */
		toolsLoaded : [],
		/**
		 * Toolbar button objects array.
		 * 
		 * @name core.ToolManager#buttons
		 * @type Array
		 * @private
		 */
		buttons : [],
		/**
		 * Number of loaded tools
		 * 
		 * @type Integer
		 * @private
		 * @name core.ToolManager#loaded
		 */
		loaded : 0,
		/**
		 * A reference to the toolbar widget
		 * 
		 * @type Toolbar
		 * @private
		 * @name core.ToolManager#toolbar
		 */
		toolbar : null,
		/**
		 * Creates a new tool manager.
		 * 
		 * @classdesc Core tool manager, handles the setup and asyncronous loading of DawgMap
		 * Tools. Creates ToolbarButtons and places them in the toolbar.
		 *
		 * @memberof core
		 * @constructor ToolManager
		 * @param {Toolbar} toolBar - A reference to the toolbar widget.
		 * @returns {ToolManager} The tool manager.
		 */
		constructor : function(toolBar) {
			if(toolBar) {
				this.toolbar = toolBar;
				this.domNode = domConstruct.create("div");
				domConstruct.place(this.domNode, this.toolbar.domNode);
				var that = this;
				this.on("tools-loaded", function(data) {
					that.initTools();
				});
			}
		},
		/**
		 * Initialize each tool, sorts the tool buttons and places icons.
		 * 
		 * @memberof core.ToolManager
		 * @private
		 * @instance
		 */
		initTools : function() {
			var that = this;
			dojo.forEach(this.toolsLoaded, function(tool, index) {
				tool.placeAt(that.domNode);
				tool.startup();
			});
			this.buttons.sort(function(a,b) {
				return a.order - b.order;
			});
			dojo.forEach(this.buttons, function(button,index) {
                that.toolbar.placeIcon(button);
			});
		},
		/**
		 * Call the startup method for each tool, which does the tool specific
		 * initialization, event binding etc.
		 * 
		 * @instance
		 * @memberof tool.ToolManager
		 * @public
		 */
		initialize : function() {
			var that = this;
			dojo.forEach(this.toolInfos, function(element, index) {
				that._load(element,index);
			});
		},
		/**
		 * Add a tool to the tool manager, load toolbar icon image, load tool HTML
		 * template, and place the ToolbarButton in the Toolbar.
		 * 
		 * @instance
		 * @public
		 * @memberof tool.ToolManager
		 * @param {Tool|String} tool - Either a tool, or a namespace where a tool can be located by the dojo amd loader.
		 * @param {Object} config - The tool specific configuration.
		 */
		add : function(tool,config) {
			var that = this;
			var toolNameSpaceParts = tool.split("/");
			this.toolInfos.push({
				toolName : toolNameSpaceParts[toolNameSpaceParts-1],
				toolbarButtonImage : require.toUrl(tool+"/icon.png"),
				toolNameSpace : tool+"/Tool",
				templateNameSpace : "dojo/text!"+tool + "/Tool.html",
				cssNameSpace : 'xstyle/css!'+tool+'/Tool.css',
                config: config
            });
		},
		/**
		 * Loads a tool asyncronously and fires an event when all tools have finished
		 * loading.
		 * 
		 * @memberof core.Toolmanager
		 * @protected
		 * @instance
		 * @param {Object} toolInfo - Object containing tool info
		 * @param {String} toolInfo.toolName - The name of the tool.
		 * @param {String} toolInfo.toolbarButtonImage - the location of the tool's icon (optional)
		 * @param {String} toolInfo.toolNameSpace - dojo namespace location of the tools main class
		 * @param {String} toolInfo.templateNameSpace - dojo namespace location of the tools template file
		 * @param {String} toolInfo.cssNameSpace - dojo namespace location of the tool's css file
		 * @param {Object} toolInfo.config - tool specific config;
		 * @param {type} index - Sort index of the tool (controls the icon ordering)
		 */
		_load : function(toolInfo,index) {
			var that = this;
			require([
				toolInfo.toolNameSpace,
				toolInfo.templateNameSpace,
				toolInfo.cssNameSpace],
			function(toolObj,toolTemplate){
				var newTool = that.addFromNameSpace(toolObj, toolTemplate, toolInfo.config);
				that.toolsLoaded.push(newTool);
				that.loaded++;
				if(newTool.isInstanceOf(BasePanelTool)) {
                    that.addButton(toolInfo.toolbarButtonImage, index, newTool.name, newTool.label, toolInfo.config);
				}
				if(that.loaded === that.toolInfos.length) {
					that.emit("tools-loaded", {});
				}
			});
		},
		/**
		 * Sets up a tool object using its config and its HTML template.
		 * 
		 * @instance
		 * @private
		 * @memberof core.ToolManager
		 * @param {Tool} toolObj
		 * @param {String} toolTemplate - Tool template HTML
		 * @param {Object} config - Tool config object
		 * @returns {Tool} An instantiated tool object
		 */
		addFromNameSpace : function(toolObj, toolTemplate, config) {
			config = config || {};
			var that = this;
			config.template = toolTemplate;
			var tool = new toolObj(config);
			return tool;
		},
		
		/**
		 * Fetches public data from a tool and returns it to the caller.
		 * 
		 * @instance
		 * @public
		 * @memberof core.ToolManager
		 * @param {String} toolName - The name of the tool
		 * @returns {Object} Data provided by the tool's publish method.
		 */
		fetchData : function(toolName) {
			for(var i = 0; i < this.toolsLoaded.length; i++) {
                if (this.toolsLoaded[i].name === toolName && this.toolsLoaded[i].fetchData) {
					return this.toolsLoaded[i].publish();
				}
			}
		},
		/**
		 * Returns a tool by its name.
		 * @param {type} toolName - The tools name.
		 * @returns {Tool} The tool.
		 */
		get : function(toolName) {
			for(var i = 0; i < this.toolsLoaded.length; i++) {
				if(this.toolsLoaded[i].name === toolName && this.toolsLoaded[i].fetchData) {
					return this.toolsLoaded[i];
				}
			}
		},
		/**
		 * Adds a button to the toolbar, binds the event handlers for the button.
		 * 
		 * @instance
		 * @private
		 * @memberof core.ToolManager
		 * @param {String} imageURL - URL to the toolbar button image.
		 * @param {String} toolName - The name of the tool this button is bound to.
		 * @param {Boolean} highlightable - Whether to highlight the button on activation.
		 */
		addButton : function(imageURL, order, toolName, highlightable, toolLabel) {
			var button = new ToolbarButton({ highlightable : highlightable,
				imageURL : imageURL, toolName : toolName, toolLabel : toolLabel.label});
			var that = this;
			button.order = order;
			button.on("toggle", function(data){
				if(data.state) {
                    that.showPanel(data.toolName);
				} else {
					that.hidePanel(data.toolName);
				}
			});
			this.buttons.push(button);
			//this.toolbar.placeIcon(button);
		},
	    /**
		 * Hides the panel associated with a tool.
		 * 
		 * @instance
		 * @public
		 * @memberof core.ToolManager
		 * @param {String} toolName - The name of the tool to hide
		 */
		hidePanel: function (toolName) {
		    for (var i = 0; i < this.toolsLoaded.length; i++) {
		        if (this.toolsLoaded[i] && this.toolsLoaded[i].name === toolName) {
		            this.toolsLoaded[i].hide();
		            dojo.query("#" + this.toolsLoaded[i].id + ".dawgmap-panel." + toolName).style("z-index", -1);
		            var icon = this.toolbar.getIcon(this.toolsLoaded[i].name);
		            icon.set("state", false);
		            icon.highlight();
		            this.numShowing--;
		        }
		    }

		},
	    /**
		 * Displays a tool's panel, hides all other tool panels.
		 * 
		 * @instance
		 * @public
		 * @memberof core.ToolManager
		 * @param {String} toolName - The name of the tool to show.
		 */
		showPanel: function (toolName) {
		    for (var i = 0; i < this.toolsLoaded.length; i++) {
		        var icon = this.toolbar.getIcon(this.toolsLoaded[i].name);
		        if (this.toolsLoaded[i] && this.toolsLoaded[i].name !== toolName) {
		            //this.toolsLoaded[i].hide();
		            //icon.set("state", false);
		            //icon.highlight();
		        } else {
		            if (this.toolsLoaded[i].hasMenu) {
		                this.numShowing++;
		                this.toolsLoaded[i].show();
		                dojo.query("#" + this.toolsLoaded[i].id + ".dawgmap-panel." + toolName).style("z-index", 999 + this.numShowing);
		            }
		            else
		                this.toolsLoaded[i].main();
		            icon.set("state", true);
		            icon.highlight();
		        }
		    }
		}
	});
});