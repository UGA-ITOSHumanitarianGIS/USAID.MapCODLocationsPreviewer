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
    'esri/toolbars/navigation',
    'esri/geometry/Extent'
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
        navToolbar,
        extent
        ) {
    return declare([BasePanelTool], {
        name : "ZoomFullTool",
        label: "ZoomFull",
        handlers: [],
        hasMenu : false,
        myButton : null,
        alreadyLoaded : false,
       
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
            //this.bindHandlers();
            
        },
        constructor: function () {
            //this.navToolbar = new navToolbar(this.map);
        },
        onHide: function () {
            this.main();
        },
        onShow: function () {
            this.main();
        },
        main: function(){
            var initialExtent = new extent(top.dawgMap.startExtent);
            this.map.setExtent(initialExtent);
        },
        
        bindHandlers : function() {
            //on(this.navToolbar, "onExtentHistoryChange", extentHistoryChangeHandler);
            on(dojo.byId(this.id), 'click', function(){
                this.main();
            });
        }
        
        });
});

