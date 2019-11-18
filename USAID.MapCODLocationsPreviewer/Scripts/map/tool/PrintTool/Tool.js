define([
	'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/dom',
    'dijit/form/Button',
    'esri/arcgis/utils',
	'esri/dijit/Print',
    'esri/tasks/PrintTemplate',
	'../base/BasePanelTool'
], function(
	declare,
        arrayUtils,
        dom,
        Button,
        arcgisUtils,
	Print,
        PrintTemplate,
	BasePanelTool
){
	return declare([BasePanelTool], {
		name : "PrintTool",
		label: "Print",
                hasMenu : false,
                myButton : null,
		layouts: [],
		templates: null,
		printer: null,
                alreadyLoaded : false,
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
		    this.layouts = [{
		        name: "Letter ANSI A Landscape",
		        label: "Landscape (PDF)",
		        format: "pdf",
		        options: {
		            legendLayers: [], // empty array means no legend
		            scalebarUnit: "Miles",
		            titleText: this.printTitle + ", Landscape PDF"
		        }
		    }, {
		        name: "Letter ANSI A Portrait",
		        label: "Portrait (Image)",
		        format: "jpg",
		        options: {
		            legendLayers: [],
		            scalebarUnit: "Miles",
		            titleText: this.printTitle + ", Portrait JPG"
		        }
		    }];

		    this.templates = arrayUtils.map(this.layouts, function (lo) {
		        var t = new PrintTemplate();
		        t.layout = lo.name;
		        t.label = lo.label;
		        t.format = lo.format;
		        t.layoutOptions = lo.options;
		        return t;
		    });
		    this.printer = new Print({
		        map: that.map,
		        templates: that.templates,
		        url: that.printUrl
		    }, dom.byId("print_button"));
		    this.printer.startup();                   
		},
		/**
		 * Creates a new print tool.
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
		constructor: function () {		                     
		},
                
                main: function () {
                    window.print();
                }

	});
});

