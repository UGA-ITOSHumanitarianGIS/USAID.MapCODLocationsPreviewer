/**
 * Core modules for the basic management of layers and tools.
 * 
 * @namespace core
 * @instance
 */
define([
    'dojo',
    'dojo/Evented',
    'dojo/_base/declare',
    'dojo/dom-construct',
    'dojo/dnd/Moveable',
    'dojo/query',
    'dojo/on',
    'dojo/dom-class',
    'esri/dijit/Popup',
    'esri/map',
    'esri/geometry/Extent',
    'esri/urlUtils',
    'esri/config',
    './widget/Toolbar/Toolbar',
    './widget/Spinner/Spinner',
    './core/SnippetManager',
    './core/ToolManager',
    './core/LayerManager',
    'esri/toolbars/navigation',
    'dijit/registry',
    'xstyle/css!./main.css'
], function (
    dojo,
    Evented,
    declare,
    domConstruct,
    Moveable,
    query,
    on,
    domClass,
    Popup,
    Map,
    Extent,
    urlUtils,
    esriConfig,
    Toolbar,
    Spinner,
    SnippetManager,
    ToolManager,
    LayerManager,
    Navigation
) {
        return declare([Evented], {

            map: null,
            toolbar: null,
            layers: null,
            spinner: null,
            toolManager: null,
            snippetManager: null,
            layerManager: null,
            dnd: null,
            config: {
                basemap: "topo",
                zoom: 8,
                mapID: "map",
                logo: false,
                showAttribution: false,
                attributionWidth: 0.45,
                displayGraphicsOnPan: true,
                fadeOnZoom: false,
                autoResize: true,
                title: "",
                loadingMessage: "Loading..",
                useProxy: true,
                alwaysUseProxy: false,
                startExtent: {
                    xmin: 2457696.5642112,
                    ymin: -2708659.9702007985,
                    xmax: 4052478.722352,
                    ymax: -1560270.0572446154,
                    spatialReference: {
                        wkid: 102100
                    }
                },
                rules: []
            },
            /**
             * Creates the dawgmap object.
             * 
             * @classdesc The DawgMap object is the main class of the framework. It
             * provides an interface with which to interact with the tool and layer
             * management components, both of which can be extended and overridden 
             * if necessary.
             * 
             * @constructor DawgMap
             * @param {Object|String} config - The main config object, or a valid JSON string.
             * @param {String} config.baseMap - A string id of the Esri basemap to load. 
             *	See the [ArcGIS JS API docs]{@link https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1} for more information
             * @param {String} config.title - The title of the map, injected into the toolbar.
             * @param {String} config.loadingMessage - The message to display when the map is updating or drawing.
             * @param {Integer} config.zoomLevel - The starting zoom level of the map.
             * @param {ToolManager} toolManager - A ToolManager object.
             * @param {LayerManager} layerManager - A LayerManager object.
             * @returns {DawgMap} DawgMap object
             */
            constructor: function (config, snippetManager, toolManager, layerManager) {
                if (typeof config === "string") {
                    config = JSON.parse(config);
                }
                declare.safeMixin(this.config, config);
                this.initMap();
                this.initBaseWidgets();
                this.snippetManager = snippetManager;
                this.bindHandlers();
                this.layerManager = layerManager;
                this.toolManager = toolManager;
                this.navToolbar = new Navigation(this.map);
                this.startExtent = this.config.startExtent;
                this.initCore();
            },
            /**
             * Adds a tool to the tool manager
             * 
             * @public
             * @instance
             * @memberof DawgMap
             * @param {Tool|String} tool - A subclass of the base tool class, or a dojo namespace string that locates the class.
             * @param {Object} config - The tools configuration object
             */
            addTool: function (tool, config) {
                if (!config && typeof tool === "object") {
                    tool.toolManager = this.toolManager;
                    tool.layerManager = this.layerManager;
                    tool.map = this.map;
                } else {
                    if (!config) config = {};
                    config.map = this.map;
                    config.layerManager = this.layerManager;
                    config.toolManager = this.toolManager;
                }
                this.toolManager.add(tool, config);
            },
            /**
             * Retrieves a tool from the tool manager.
             * 
             * @public
             * @instance
             * @memberof DawgMap
             * @param {Tool} toolName - The name of the tool as defined in the tool's config object.
             * @returns {Tool} The tool.
             */
            getTool: function (toolName) {
                return this.toolManager.get(toolName);
            },
            /**
             * Adds a layer to the layer manager.
             * 
             * @public
             * @instance
             * @memberof DawgMap
             * @param {DawgMapLayer|Layer} layer - Either a DawgMapLayer or an Esri Layer.
             */
            addLayer: function (layer) {
                this.layerManager.add(layer);
            },
            /**
             * Adds a set of layers to the layer manager.
             * 
             * @public
             * @instance
             * @memberof DawgMap
             * @param {Array} layers
             */
            addLayers: function (layers) {
                for (var v = 0; v < layers.length; v++) {
                    this.addLayer(layers[v]);
                }
            },

            addSnippet: function (snippet) {
                this.snippetManager.add(snippet);
            },
            /**
             * Triggers the initialization and setup of the layerManager, 
             * which adds layers to the map. This has to be done in a separate step 
             * because all the layers need to be added simultaneously or theres no 
             * way to garantee that all of them have been loaded prior
             * to initializing individual tools. 
             * 
             * @public
             * @instance
             * @memberof DawgMap
             */
            initialize: function () {
                var that = this;
                if (this.map.loaded) {
                    this.layerManager.initialize();
                } else {
                    this.map.on("load", function () {
                        that.layerManager.initialize();
                    });
                }
            },
            /**
             * Constructs the default ToolManager and LayerManager if needs be.
             * 
             * @private
             * @instance
             * @memberof DawgMap
             */
            initCore: function () {
                var that = this;
                if (!this.toolManager) {
                    this.toolManager = new ToolManager(this.toolbar);
                }
                if (!this.layerManager) {
                    this.layerManager = new LayerManager(this.map);
                }
                if (!this.snippetManager) {
                    this.snippetManager = new SnippetManager(this.map);
                }
                this.toolManager.on("tools-loaded", function () {
                    that.emit("init-complete", {});
                });
            },
            /**
             * Initialize the toolbar, and loading spinner widgets.
             * 
             * @private
             * @instance
             * @memberof DawgMap
             */
            initBaseWidgets: function () {
                this.toolbar = new Toolbar();
                this.toolbar.startup();
                this.toolbar.placeAt(dojo.byId(this.config.mapID));
                this.toolbar.set("title", this.config.title);
                this.spinner = new Spinner();
                this.spinner.startup();
                this.spinner.placeAt(dojo.byId(this.config.mapID));
            },
            /**
             * Bind the necessary event handlers. Initializes tools when all layers
             * are finished being added to the map and loaded. Also shows the spinner
             * when the map is updating or drawing.
             * 
             * @private
             * @instance
             * @memberof DawgMap
             */
            bindHandlers: function () {
                var that = this;
                this.map.on("layers-add-result", function () {
                    that.toolManager.initialize();
                });
                this.map.on("update-start", function () {
                    that.spinner.showWithMessage(that.config.loadingMessage);
                });
                this.map.on("update-end", function () {
                    that.spinner.hide();
                });
                on(this.dnd, 'FirstMove', function () {
                    var arrowNode = query(".outerPointer", this.map.infoWindow.domNode)[0];
                    domClass.add(arrowNode, "inv");

                    var arrowNode = query(".pointer", this.map.infoWindow.domNode)[0];
                    domClass.add(arrowNode, "inv");
                }.bind(this));
                var cHandle = query(".titleButton", this.map.infoWindow.domNode)[3];

            },
            /**
             * Performs map setup like constructing the maps popup, and setting the
             * starting extent. Options are pulled from the DawgMap main config object.
             * 
             * @private
             * @instance
             * @memberof DawgMap
             */
            initMap: function () {
                var popup = new Popup({}, domConstruct.create("div"));
                var config = {
                    attributionWidth: this.config.attributionWidth,
                    extent: new Extent(this.config.startExtent),
                    showAttribution: this.config.showAttribution,
                    logo: this.config.showEsriLogo,
                    autoResize: this.config.autoResize,
                    displayGraphicsOnPan: this.config.displayGraphicsOnPan,
                    fadeOnZoom: this.config.fadeOnZoom,
                    basemap: this.config.basemap,
                    infoWindow: popup
                };
                this.map = new Map(this.config.mapID, config);
                var handle = query(".title", this.map.infoWindow.domNode)[0];

                this.dnd = new Moveable(this.map.infoWindow.domNode, {
                    handle: handle
                });

                if (this.config.rules.length > 0) {
                    for (i = 0; i < this.config.rules.length; i++) {
                        urlUtils.addProxyRule({
                            urlPrefix: this.config.rules[i].urlPrefix,
                            proxyUrl: this.config.rules[i].proxyUrl
                        });
                    };
                };
                //this.config.defaults.io.corsEnabledServers.push("maps.itos.uga.edu");
                esriConfig.defaults.io.corsEnabledServers.push("mapsdev.itos.uga.edu");
                esriConfig.defaults.io.corsEnabledServers.push("maps.itos.uga.edu");
                esriConfig.defaults.io.corsEnabledServers.push("egis.dot.ga.gov");
                esriConfig.defaults.io.corsEnabledServers.push("services.nationalmap.gov");
                esriConfig.defaults.io.corsEnabledServers.push("gistmaps.itos.uga.edu");
                esriConfig.defaults.io.corsEnabledServers.push("api.worldbank.org");
            }

        });
    });