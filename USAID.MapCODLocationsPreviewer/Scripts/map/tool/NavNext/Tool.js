define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/dom',
    'dojo/on',
    'dijit/form/Button',
    'esri/arcgis/utils',
    'esri/dijit/Print',
    'esri/tasks/PrintTemplate',
    '../base/BasePanelTool',
    'dijit/registry',
    'esri/toolbars/navigation'
], function (
	declare,
        arrayUtils,
        dom,
        on,
        Button,
        arcgisUtils,
	Print,
        PrintTemplate,
	BasePanelTool,
        registry,
        Navigation
) {
    return declare([BasePanelTool], {
        name: "NavNextTool",
        label: "NavNext",
        hasMenu: false,
        myButton: null,
        handlers : [],
        layouts: [],
        templates: null,
        printer: null,
        navToolbar: null,
        alreadyLoaded: false,
        /**
		 * Starts the Esri print widget.
		 * 
		 * @protected
		 * @override
		 * @instance
		 * @memberof tool.PrintTool
		 */
        startup: function () {
            var that = this;
            this.inherited(arguments); // calls parent class' startup method
            
        },
        constructor: function () {
            this.navToolbar = top.dawgMap.navToolbar;
        },
        /**
		 * Listners for tool even through now control shows when clicked
		 * 
		 * @override
		 * @instance
		 * @protected
		 * @memberof tool.SelectionTool
		 */
        onHide : function() {
                this.main();
        },
        onShow : function() {
                this.main();
        },
        extentHistoryChangeHandler: function() {
                registry.byId("zoomprev").disabled = top.dawgMap.navToolbar.isFirstExtent();
                registry.byId("zoomnext").disabled = top.dawgMap.navToolbar.isLastExtent();
        },
        main: function () {
            top.dawgMap.navToolbar.zoomToNextExtent();
        },
        
        });
});

