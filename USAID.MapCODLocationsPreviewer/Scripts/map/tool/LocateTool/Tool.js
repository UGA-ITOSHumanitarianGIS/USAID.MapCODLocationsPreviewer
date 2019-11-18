define([
	'dojo/_base/declare',
	'dojo/on',
	'esri/tasks/locator',
	'esri/graphic',
	'esri/geometry/Point',
	'../base/BasePanelTool'
], function(
	declare, 
	on,
	Locator,
	Graphic,
	Point,
	BasePanelTool
){
	return declare([BasePanelTool], {
		name: "LocateTool",
		label : "Locate",
                hasMenu : true,
		marker : null,
		config : {
			url : "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
			fieldName : "SingleLine",
			markerSymbol : {
				"type":"esriSMS",
				"color" : [0, 51, 204, 255],
				"style" : "esriSMSCircle",
				"size" : 12,
				"angle":0,
				"xoffset":0,
				"yoffset":0,
				"outline" : {
					"type":"esriSLS",
					"color" : [0, 51, 204, 110],
					"width" : 8,
					"style" : "esriSLSSolid"
				}
			}
		},
		/**
		 * Creates a new LocateTool. 
		 * 
		 * @classdesc The locate tool is used for geocoding addresses and displaying 
		 * the user's current location on the map. Draws a point on the map following 
		 * the successful geocoding or geolocationg operation.
		 * 
		 * @constructor LocateTool
		 * @memberof tool
		 * @extends tool.base.BasePanelTool
		 * @param {Object} config - Object containing all tool options
		 * @param {String} config.url - Geocoding service URL.
		 * @param {String} config.fieldName - Single line geocoding field name in service, the name of the field that all search terms are associated with.
		 * @param {Object} config.markerSymbol - An Esri symbol object for point geometry, controls the appearance of the map marker for the geocoder. 
		 *	See the [SimpleMarkerSymbol documentation]{@link https://developers.arcgis.com/javascript/jsapi/simplemarkersymbol-amd.html} for more information.
		 * @returns {LocateTool} The new locate tool
		 */
		constructor : function(config) {
		},
		/**
		 * Construct the Esri Locator widget. See the 
		 * [Locator documentation]{@link https://developers.arcgis.com/javascript/jsapi/locator-amd.html} for more information
		 * @instance
		 * @protected
		 * @override
		 * @memberof tool.LocateTool
		 */
		postCreate : function() {
			this.locator = new Locator(this.config.url);
		},
		/**
		 * Bind all the dom event handlers.
		 * 
		 * @instance
		 * @protected
		 * @override
		 * @memberof tool.LocateTool
		 */
		startup : function() {
			this.inherited(arguments);
			this.bindHandlers();
		},
		/**
		 * Functionality to be called whenever the tool is shown or hidden. See
		 * the [ShowHideMixin documentation]{@link mixin.ShowHideMixin#onHide}.
		 * 
		 * @override
		 * @public
		 * @memberof tool.LocateTool
		 */
		onHide : function() {
			if(this.marker) {
				this.map.graphics.remove(this.marker);
			}
		},
		/**
		 * Functionality to be called whenever the tool is shown or hidden. See
		 * the [ShowHideMixin documentation]{@link mixin.ShowHideMixin#onShow}.
		 * 
		 * @override
		 * @public
		 * @memberof tool.LocateTool
		 */
		onShow : function() {
			if(this.marker) {
				this.map.graphics.add(this.marker);
				this.marker.attr("id", "locateMarker");
			}
		},
		/**
		 * Locates a point based on a single line address string.
		 * 
		 * @private
		 * @memberof tool.LocateTool
		 * @instance
		 * @param {String} address - An address string
		 */
		markByAddress : function(address) {
			var addressObj = {};
			var that = this;
			addressObj[this.config.fieldName] = address;
			this.locator.outSpatialReference = this.map.spatialReference;
			this.locator.addressToLocations({
				address: addressObj,
				outFields: ["Loc_name"]
			}, function(candidates) {
				that.markPoint(candidates[0].location);
			});
		},
		/**
		 * Uses HTML5 Geolocation to mark the user's current location on the map.
		 * 
		 * @private
		 * @instance
		 * @memberof tool.LocateTool
		 */
		markByCurrentLocation : function() {
			var that = this;
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(location) {
					that.markPoint(location);
				}, function(error){
					that.locationError(error);
				});
			}
		},
		/**
		 * Marks a given location (lat long coords) on the map with the point symbol
		 * set in the class constructor, then zooms to that point on the map. 
		 * 
		 * @memberof tool.LocateTool
		 * @instance
		 * @private
		 * @param {Object} location - Location object, either the return value of the call
		 *	to the HTML5 geolocation API or the results of a geocode operation.
		 */
		markPoint : function(location) {
			var that = this;
			var pt;
			if(location.coords) {
				 pt = new Point(location.coords.longitude, location.coords.latitude);
			}else {
				pt = new Point(location.x, location.y, location.spatialReference);
			}
			if(that.marker) {
				that.marker.setGeometry(pt);
			} else {
				var markerJson = {
					symbol : this.config.markerSymbol,
					geometry : pt.toJson()
				};
				that.marker = new Graphic(markerJson);
				that.map.graphics.add(that.marker);
			}
			that.map.centerAndZoom(pt,12);
		},
		/**
		 * 
		 * Bind the event handlers for form submission and graphic additions to
		 * the map.
		 * 
		 * @private
		 * @instance
		 * @memberof tool.LocateTool
		 */
		bindHandlers : function() {
			var that = this;
			on(this._form, "submit", function(evt) {
				evt.preventDefault();
				var type = dojo.query("input:checked",that._form);
				type = type[0].value;
				if(type === "address") {
					that.markByAddress(that._address.value);
				} else {
					that.markByCurrentLocation();
				}
			});
			this.map.graphics.on("graphic-node-add", function(graphic) {
				that.marker.attr("id", "locateMarker");
			});
		}
	});
});

