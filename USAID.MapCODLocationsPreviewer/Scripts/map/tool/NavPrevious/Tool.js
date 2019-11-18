define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/dom',
    'dojo/on',
    'dijit/form/Button',
    'esri/arcgis/utils',
    'esri/dijit/Print',
    'dijit/registry',
    'esri/tasks/PrintTemplate',
    '../base/BasePanelTool',
    'esri/toolbars/navigation'
], function (
        declare,
        arrayUtils,
        dom,
        on,
        Button,
        arcgisUtils,
        Print,
        registry,
        PrintTemplate,
        BasePanelTool,
        Navigation
        ) {
    return declare([BasePanelTool], {
        name: "NavPreviousTool",
        label: "NavPrevious",
        hasMenu: false,
        myButton: null,
        layouts: [],
        templates: null,
        navToolbar: null,
        printer: null,
        alreadyLoaded: false,
        printTitle: "Sample Title",
        printUrl: "https://maps.itos.uga.edu/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
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
            top.dawgMap.navToolbar.on("extent-history-change", this.extentHistoryChangeHandler);
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
                //registry.byId("zoomprev").disabled = top.dawgMap.navToolbar.isFirstExtent();
                //registry.byId("zoomnext").disabled = top.dawgMap.navToolbar.isLastExtent();
        },
        main: function () {
            top.dawgMap.navToolbar.zoomToPrevExtent();
        }, 
       

    });
});

