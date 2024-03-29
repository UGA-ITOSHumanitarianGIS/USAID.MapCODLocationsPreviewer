define([
    "dojo/_base/declare",
    "esri/config",
    "esri/domUtils",
    "esri/graphic",
    "esri/InfoTemplate",
    "esri/map",
    "esri/request",
    "esri/urlUtils",
    "esri/dijit/InfoWindowLite",
    "esri/geometry/Multipoint",
    "esri/geometry/Point",
    "esri/geometry/webMercatorUtils",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/ArcGISImageServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/symbols/PictureMarkerSymbol",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/json",
    "dojo/on",
    "dojo/parser",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojox/data/CsvStore",
    "dojox/encoding/base64",
    "dijit/Dialog",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dojo/domReady!"
], function (
    declare, esriConfig, domUtils, Graphic, InfoTemplate, Map, request, urlUtils,
    InfoWindowLite, Multipoint, Point, webMercatorUtils, ArcGISDynamicMapServiceLayer,
    ArcGISImageServiceLayer, FeatureLayer, PictureMarkerSymbol, dom, domConstruct,
    JSON, on, parser, arrayUtils, lang, CsvStore, base64
) {
    return declare([], {
        name: "DragDropData",

        //map : null,
        /*
         * Creates a new DragDropData.
         * 
         * @classdesc
         * https://developers.arcgis.com/javascript/3/jssamples/exp_dragdrop.html
         * 
         * @memberof core
         * @constructor DragDropDAta
         * @param {type} map - A reference to the esri map object, set automatically.
         */
        constructor: function (map) {
            this.map = map;
            parser.parse();
            latFieldStrings = ["lat", "latitude", "y", "ycenter"];
            longFieldStrings = ["lon", "long", "longitude", "x", "xcenter"];

            this.inherited(arguments); // calls parent class' startup method      
            this.bindHandlers();

        },
        bytesToString: function (b) {
            var s = [];
            arrayUtils.forEach(b, function (c) {
                s.push(String.fromCharCode(c));
            });
            return s.join("");
        },

        bindHandlers: function () {
            var that = this;
            //on(dom.byId("clearButton"), "click", clearAll);
            this.setupDropZone();
        },
        setupDropZone: function (event) {
            console.log('dropzone');
            if (!window.File || !window.FileReader) {
                domUtils.show(dom.byId('msg'));
                return;
            }

            var mapCanvas = map;
            // Reference
            // http://www.html5rocks.com/features/file
            // http://www.html5rocks.com/tutorials/dnd/basics/
            // http://developer.mozilla.org/En/DragDrop/Drag_Operations
            on(mapCanvas, "dragenter", function (event) {
                // If we don't prevent default behavior here, browsers will
                // perform the default action for the file being dropped i.e,
                // point the page to the file.
                event.preventDefault();
            });

            on(mapCanvas, "dragover", function (event) {
                event.preventDefault();
            });
            on(mapCanvas, "drop", this.handleDrop);
        },
        handleDrop: function (event) {
            console.log('handledrop');
            event.preventDefault();
            // Reference
            // http://www.html5rocks.com/tutorials/file/dndfiles/
            // http://developer.mozilla.org/en/Using_files_from_web_applications
            var dataTransfer = event.dataTransfer,
                files = dataTransfer.files,
                types = dataTransfer.types;

            // File drop?
            if (files && files.length === 1) {
                console.log("[ FILES ]");
                var file = files[0]; // that's right I'm only reading one file
                console.log("type = ", file.type);
                if (file.type.indexOf("image/") !== -1) {
                    this.handleImage(file, event.layerX, event.layerY);
                }
                else if (file.name.indexOf(".csv") !== -1) {
                    handleCSV(file);
                }
            }

            // Textual drop?
            else if (types) {
                console.log("[ TYPES ]");
                console.log("  Length = ", types.length);
                arrayUtils.forEach(types, function (type) {
                    if (type) {
                        console.log("  Type: ", type);
                        console.log("  Data: ", dataTransfer.getData(type));
                    }
                });

                // We're looking for URLs only.
                var url;
                arrayUtils.some(types, function (type) {
                    if (type.indexOf("text/uri-list") !== -1) {
                        url = dataTransfer.getData("text/uri-list");
                        return true;
                    }
                    else if (type.indexOf("text/x-moz-url") !== -1) {
                        url = dataTransfer.getData("text/plain");
                        return true;
                    }
                    else if (type.indexOf("text/plain") !== -1) {
                        url = dataTransfer.getData("text/plain");
                        url = url.replace(/^\s+|\s+$/g, "");
                        if (url.indexOf("https") === 0) {
                            return true;
                        }
                    }
                    return false;
                });

                if (url) {
                    url = url.replace(/^\s+|\s+$/g, "");
                    // Check if this URL is a google search result.
                    // If so, parse it and extract the actual URL
                    // to the search result
                    if (url.indexOf("www.google.com/url") !== -1) {
                        var obj = urlUtils.urlToObject(url);
                        if (obj && obj.query && obj.query.url) {
                            url = obj.query.url;
                        }
                    }

                    if (url.match(/MapServer\/?$/i)) {
                        // ArcGIS Server Map Service?
                        handleMapServer(url);
                    }
                    else if (url.match(/(Map|Feature)Server\/\d+\/?$/i)) {
                        // ArcGIS Server Map/Feature Service Layer?
                        this.handleFeatureLayer(url);
                    }
                    else if (url.match(/ImageServer\/?$/i)) {
                        // ArcGIS Server Image Service?
                        this.handleImageService(url);
                    }
                }
            }
        },

        handleImage: function (file, x, y) {
            console.log("Processing IMAGE: ", file, ", ", file.name, ", ", file.type, ", ", file.size);
            var reader = new FileReader();
            reader.onload = function () {
                console.log("Finished reading the image");
                // Create an image element just to find out the image
                // dimension before adding it as a graphic
                var img = domConstruct.create("img");
                img.onload = function () {
                    var width = img.width,
                        height = img.height;
                    console.log("Image dimensions: ", width, ", ", height);

                    // Add a graphic with this image as its symbol
                    var symbol = new PictureMarkerSymbol(reader.result,
                        width > 64 ? 64 : width,
                        height > 64 ? 64 : height);
                    var point = map.toMap(new Point(x, y));
                    var graphic = new Graphic(point, symbol);
                    map.graphics.add(graphic);
                };

                img.src = reader.result;
            };

            // Note that it's possible to monitor read progress as well:
            // http://www.html5rocks.com/tutorials/file/dndfiles/#toc-monitoring-progress
            // http://www.html5rocks.com/tutorials/file/dndfiles/#toc-reading-files
            reader.readAsDataURL(file);
        },

        handleFeatureLayer: function (url) {
            console.log("Processing FL: ", url);
            var layer = new FeatureLayer(url, {
                opacity: 0.75,
                mode: FeatureLayer.MODE_ONDEMAND,
                infoTemplate: new InfoTemplate(null, "${*}")
            });
            top.dawgMap.addLayer(layer);
        },

        handleImageService: function (url) {
            console.log("Processing IS: ", url);
            var layer = new ArcGISImageServiceLayer(url, {
                opacity: 0.75
            });
            top.dawgMap.addLayer(layer);
        },

        clearAll: function () {
            map.graphics.clear();
            var layerIds = map.graphicsLayerIds.slice(0);
            layerIds = layerIds.concat(map.layerIds.slice(1));

            arrayUtils.forEach(layerIds, function (layerId) {
                map.removeLayer(map.getLayer(layerId));
            });
        },
    });
    
    function handleMapServer (url) {
        console.log("Processing MS: ", url);
        var layer = new ArcGISDynamicMapServiceLayer(url, {
            opacity: 0.75
        });
        top.dawgMap.map.addLayer(layer);
    }
    function handleCSV (file) {
        console.log("Processing CSV: ", file, ", ", file.name, ", ", file.type, ", ", file.size);
        if (file.data) {
            var decoded = bytesToString(base64.decode(file.data));
            processCSVData(decoded);
        }
        else {
            var reader = new FileReader();
            reader.onload = function () {
                console.log("Finished reading CSV data");
                processCSVData(reader.result);
            };
            reader.readAsText(file);
        }
    }
    function processCSVData (data) {
        var newLineIndex = data.indexOf("\n");
        var firstLine = lang.trim(data.substr(0, newLineIndex)); //remove extra whitespace, not sure if I need to do this since I threw out space delimiters
        var separator = getSeparator(firstLine);
        var csvStore = new CsvStore({
            data: data,
            separator: separator
        });

        csvStore.fetch({
            onComplete: function (items) {
                var objectId = 0;
                var featureCollection = generateFeatureCollectionTemplateCSV(csvStore, items);
                var popupInfo = generateDefaultPopupInfo(featureCollection);
                var infoTemplate = new InfoTemplate(buildInfoTemplate(popupInfo));
                var latField, longField;
                var fieldNames = csvStore.getAttributes(items[0]);
                arrayUtils.forEach(fieldNames, function (fieldName) {
                    var matchId;
                    matchId = arrayUtils.indexOf(latFieldStrings,
                        fieldName.toLowerCase());
                    if (matchId !== -1) {
                        latField = fieldName;
                    }

                    matchId = arrayUtils.indexOf(longFieldStrings,
                        fieldName.toLowerCase());
                    if (matchId !== -1) {
                        longField = fieldName;
                    }
                });

                // Add records in this CSV store as graphics
                arrayUtils.forEach(items, function (item) {
                    var attrs = csvStore.getAttributes(item),
                        attributes = {};
                    // Read all the attributes for  this record/item
                    arrayUtils.forEach(attrs, function (attr) {
                        var value = Number(csvStore.getValue(item, attr));
                        attributes[attr] = isNaN(value) ? csvStore.getValue(item, attr) : value;
                    });

                    attributes["__OBJECTID"] = objectId;
                    objectId++;

                    var latitude = parseFloat(attributes[latField]);
                    var longitude = parseFloat(attributes[longField]);

                    if (isNaN(latitude) || isNaN(longitude)) {
                        return;
                    }

                    var geometry = webMercatorUtils
                        .geographicToWebMercator(new Point(longitude, latitude));
                    var feature = {
                        "geometry": geometry.toJson(),
                        "attributes": attributes
                    };
                    featureCollection.featureSet.features.push(feature);
                });

                var featureLayer = new FeatureLayer(featureCollection, {
                    infoTemplate: infoTemplate,
                    id: 'csvLayer'
                });
                featureLayer.__popupInfo = popupInfo;
                top.dawgMap.map.addLayer(featureLayer);
                zoomToData(featureLayer);
            },
            onError: function (error) {
                console.error("Error fetching items from CSV store: ", error);
            }
        });
    }
    function getSeparator (string) {
        var separators = [",", "      ", ";", "|"];
        var maxSeparatorLength = 0;
        var maxSeparatorValue = "";
        arrayUtils.forEach(separators, function (separator) {
            var length = string.split(separator).length;
            if (length > maxSeparatorLength) {
                maxSeparatorLength = length;
                maxSeparatorValue = separator;
            }
        });
        return maxSeparatorValue;
    }
        function zoomToData (featureLayer) {
                // Zoom to the collective extent of the data
                var multipoint = new Multipoint(top.dawgMap.map.spatialReference);
                arrayUtils.forEach(featureLayer.graphics, function (graphic) {
                    var geometry = graphic.geometry;
                    if (geometry) {
                        multipoint.addPoint({
                            x: geometry.x,
                            y: geometry.y
                        });
                    }
                });

                if (multipoint.points.length > 0) {
                    top.dawgMap.map.setExtent(multipoint.getExtent().expand(1.25), true);
                }
        }
   
    function generateDefaultPopupInfo (featureCollection) {
        var fields = featureCollection.layerDefinition.fields;
        var decimal = {
            'esriFieldTypeDouble': 1,
            'esriFieldTypeSingle': 1
        };
        var integer = {
            'esriFieldTypeInteger': 1,
            'esriFieldTypeSmallInteger': 1
        };
        var dt = {
            'esriFieldTypeDate': 1
        };
        var displayField = null;
        var fieldInfos = arrayUtils.map(fields,
            lang.hitch(this, function (item) {
                if (item.name.toUpperCase() === "NAME") {
                    displayField = item.name;
                }
                var visible = (item.type !== "esriFieldTypeOID" &&
                    item.type !== "esriFieldTypeGlobalID" &&
                    item.type !== "esriFieldTypeGeometry");
                var format = null;
                if (visible) {
                    var f = item.name.toLowerCase();
                    var hideFieldsStr = ",stretched value,fnode_,tnode_,lpoly_,rpoly_,poly_,subclass,subclass_,rings_ok,rings_nok,";
                    if (hideFieldsStr.indexOf("," + f + ",") > -1 ||
                        f.indexOf("area") > -1 || f.indexOf("length") > -1 ||
                        f.indexOf("shape") > -1 || f.indexOf("perimeter") > -1 ||
                        f.indexOf("objectid") > -1 || f.indexOf("_") == f.length - 1 ||
                        f.indexOf("_i") == f.length - 2) {
                        visible = false;
                    }
                    if (item.type in integer) {
                        format = {
                            places: 0,
                            digitSeparator: true
                        };
                    }
                    else if (item.type in decimal) {
                        format = {
                            places: 2,
                            digitSeparator: true
                        };
                    }
                    else if (item.type in dt) {
                        format = {
                            dateFormat: 'shortDateShortTime'
                        };
                    }
                }

                return lang.mixin({}, {
                    fieldName: item.name,
                    label: item.alias,
                    isEditable: false,
                    tooltip: "",
                    visible: visible,
                    format: format,
                    stringFieldOption: 'textbox'
                });
            }));

        var popupInfo = {
            title: displayField ? '{' + displayField + '}' : '',
            fieldInfos: fieldInfos,
            description: null,
            showAttachments: false,
            mediaInfos: []
        };
        return popupInfo;
    }

    function buildInfoTemplate (popupInfo) {
        var json = {
            content: "<table>"
        };

        arrayUtils.forEach(popupInfo.fieldInfos, function (field) {
            if (field.visible) {
                json.content += "<tr><td valign='top'>" + field.label +
                    ": <\/td><td valign='top'>${" + field.fieldName + "}<\/td><\/tr>";
            }
        });
        json.content += "<\/table>";
        return json;
    }
    function generateFeatureCollectionTemplateCSV (store, items) {
        //create a feature collection for the input csv file
        var featureCollection = {
            "layerDefinition": null,
            "featureSet": {
                "features": [],
                "geometryType": "esriGeometryPoint"
            }
        };
        featureCollection.layerDefinition = {
            "geometryType": "esriGeometryPoint",
            "objectIdField": "__OBJECTID",
            "type": "Feature Layer",
            "typeIdField": "",
            "drawingInfo": {
                "renderer": {
                    "type": "simple",
                    "symbol": {
                        "type": "esriPMS",
                        "url": "https://static.arcgis.com/images/Symbols/Basic/RedSphere.png",
                        "imageData": "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",
                        "contentType": "image/png",
                        "width": 15,
                        "height": 15
                    }
                }
            },
            "fields": [
                {
                    "name": "__OBJECTID",
                    "alias": "__OBJECTID",
                    "type": "esriFieldTypeOID",
                    "editable": false,
                    "domain": null
                }
            ],
            "types": [],
            "capabilities": "Query"
        };

        var fields = store.getAttributes(items[0]);
        arrayUtils.forEach(fields, function (field) {
            var value = store.getValue(items[0], field);
            var parsedValue = Number(value);
            if (isNaN(parsedValue)) { //check first value and see if it is a number
                featureCollection.layerDefinition.fields.push({
                    "name": field,
                    "alias": field,
                    "type": "esriFieldTypeString",
                    "editable": true,
                    "domain": null
                });
            }
            else {
                featureCollection.layerDefinition.fields.push({
                    "name": field,
                    "alias": field,
                    "type": "esriFieldTypeDouble",
                    "editable": true,
                    "domain": null
                });
            }
        });
        return featureCollection;
    }
});