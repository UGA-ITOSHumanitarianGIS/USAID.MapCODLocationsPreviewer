/**
 * Tools are extensible pieces of functionality that can interact with the map in
 * some meaningful way. They have a predictable structure and typically inherit
 * from one of the main base classes. 
 * 
 * @namespace tool
 * @instance
 */
define([
	'dojo/_base/declare',
	'esri/dijit/BasemapGallery',
	'../base/BasePanelTool'
],
function(
	declare,
	BasemapGallery,
	BasePanelTool
) {
	return declare([BasePanelTool], {
		name : "BaseMapGalleryTool",
		label : "Base Map Gallery",
		gallery: null,
        hasMenu: true,
		/**
		 * Basemap gallery, allows users to switch basemaps on demand. Basically
		 * just a wrapper class around Esri's BaseMapGallery dijit that extends 
		 * DawgMap's
		 * 
		 * @extends tool.base.BasePanelTool
		 * @constructor BaseMapGalleryTool
		 * @memberof tool
		 * @param {type} config - The tool's config object
		 * @returns {BaseMapGalleryTool} The BaseMapGalleryTool object
		 */
		constructor : function(config) {
		},
		/**
		 * Startup function, part of dojos widget lifecycle. Initializes the
		 *  basemap gallery widget. Called by the tool manager after map and layers
		 *  have been initialized.
		 * 
		 * @public
		 * @instance
		 * @memberof BaseMapGalleryTool
		 * @returns {undefined}
		 */
		startup : function() {
			this.inherited(arguments);
			this.gallery = new BasemapGallery({
				map : this.map
			}, this._container);
			this.gallery.startup();
		}
	});
});

