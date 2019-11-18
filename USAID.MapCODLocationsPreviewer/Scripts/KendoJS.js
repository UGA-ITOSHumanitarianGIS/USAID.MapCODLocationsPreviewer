//create DatePicker from input HTML element
jQuery(document).ready(function ($)
{
    jQuery("#inputProjectInitiationDate").kendoDatePicker();
    jQuery("#ProjectAreaPanelBar").kendoPanelBar
    ({
        expandMode: "single"
    });
    jQuery("#ProjectAreaPanelBarEdit").kendoPanelBar
    ({
        expandMode: "single"
    });
    $(".resizeable").resizable({
    });

    $(".draggable").draggable({
        cursor: "crosshair"
    });

    $(window).resize(function (e) {
        if ($(window).width() <= 800) {
            document.getElementById("detailsDiv").style.height = "40%";
            document.getElementById("detailsDiv").style.width = "85%";
            document.getElementById("detailsContentDiv").style.width = "85%";
            document.getElementById("detailsDiv").style.top = "45%";
            document.getElementById("detailsDiv").style.overflowY = "scroll";
            document.getElementById("detailsDiv").style.zindex = "1000000";
        }

    });

});


 
//zoom-in image button in project area grid
function zoomToProjectItem(objectid)
{
    top.dawgMap.map.graphics.clear();
    var asymbol = new esri.symbol.SimpleMarkerSymbol().setStyle(esri.symbol.SimpleMarkerSymbol.STYLE_DIAMOND);
    jQuery(function ($)
    {
        $(document).ready(function ()
        {
            require(["esri/tasks/query", "esri/tasks/QueryTask", 'esri/graphicsUtils'],
            function (Query, QueryTask, graphicsUtils)
            {
                    var query = new Query();
                    query.returnGeometry = true;
                    query.outSpatialReference = { "wkid": 4326 };
                    query.outFields = ["*"];
                    var queryTask = new QueryTask();
                queryTask = new QueryTask(sitePath + "/Proxy/Index?" + sitescript.urlCOD + "/query?where=OBJECTID=" + objectid + "&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&gdbVersion=&historicMoment=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=&resultOffset=&resultRecordCount=&returnTrueCurves=false&sqlFormat=none&f=pjson");
                    query.where = "OBJECTID = " + objectid;
                    queryTask.execute(query, function (FeatureSet)
                    {
                        if (FeatureSet.features.length == 0)
                        {
                            //alert("Cannot find the geometry.");
                            var myWindow = jQuery("#window"),
                            undo = jQuery("#undo");

                            undo.click(function ()
                            {
                                myWindow.data("kendoWindow").open();
                                undo.fadeOut();
                            });

                            function onClose()
                            {
                                undo.fadeIn();
                            }

                            myWindow.kendoWindow({
                                width: "700px",
                                height: "260px",
                                title: "Important Information!",
                                visible: false,
                                actions: ["Close"],
                                close: onClose
                            }).data("kendoWindow").center().open();
                            jQuery("#contentRight").text("Sorry. The geometry cannot be found.");
                            jQuery("#imageLeft").attr("src", jQuery("#imageLeft").attr("src").replace("success_graphic.png", "error_graphic.png"));
                        }
                        else
                        {
                            for (j = 0; j < FeatureSet.features.length; j++)
                            {
                                //display centroid
                                var centroid = FeatureSet.features[j].geometry.getCentroid();
                                var agraphic = new esri.Graphic(centroid, asymbol);
                                top.dawgMap.map.graphics.add(agraphic);
                            }
                            var newExtent = graphicsUtils.graphicsExtent(FeatureSet.features);
                            newExtent.update(newExtent.xmin - 1.5 * (newExtent.xmax - newExtent.xmin), newExtent.ymin,
                                newExtent.xmax, newExtent.ymax, newExtent.spatialReference);

                            top.dawgMap.map.setExtent(newExtent, true);

                        }
                    },
                    function (error)
                    {
                        //alert(error);
                    });
                });
        });
    });
}


//zoom to single polygon
function zoomToPolygon(PolygonId)
{
    jQuery(function ($)
    {
        $(document).ready(function ()
        {

            require(["esri/geometry/Point", "esri/map", 'esri/geometry/webMercatorUtils'],
            function (Point, Map, webMercatorUtils)
            {
                var coordiantesString = document.getElementById("reviewMetadata" + PolygonId.toString()).innerText;
                var pos = coordiantesString.indexOf(":");

                var lon = coordiantesString.substr(pos + 1, 11) * 1;
                var lat = coordiantesString.substr(pos + 13, 10) * 1;

                var point = new Point(lon, lat);
                var map_point = webMercatorUtils.geographicToWebMercator(point);

                top.dawgMap.map.centerAt(map_point);
                var newExtent = top.dawgMap.map.extent;
                map_point.x = map_point.x - (newExtent.xmax - newExtent.xmin)/4;                
                top.dawgMap.map.centerAt(map_point);

            });
        });
    });
}
