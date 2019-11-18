
jQuery.noConflict();

var sitePath = "";
var mydiv = ".k-grid-content.k-auto-scrollable";
var sitescript = {};

jQuery(document).ready(function () {
    //Dynamically create a path to the current application's base URL
    if (!location.origin)
    { sitePath = location.protocol + "//" + location.host; }
    else { sitePath = location.protocol + '//' + location.host; }

    if (jQuery("#hiddenApplicationName").length) { sitePath = sitePath + "/" + jQuery("#hiddenApplicationName").val() }
    jQuery(".profilePane").click(function (e) { location.href = sitePath + "/Home/Login" });

    jQuery("#detailsDiv").resizable({
        minWidth: 400,
        minHeight: 500,
        //alsoResize: "#ivSearchGridReview",
        alsoResize: "#divSearchGridProjectArea"        
    });

    jQuery("#detailsDiv").resize(function (e) {
        jQuery("#divSearchGridProjectArea").data("kendoGrid").resize();
        jQuery("#divSearchGridReview").data("kendoGrid").resize();
    });

    //jQuery("#detailsDiv").resizable({
    //    //alsoResize: "#projectAreaContent"
    //    alsoResize: ".k-grid-content"
    //});

    //jQuery("#detailsDiv").resize(function (e) {
    //    console.log('resizing');
    //    var c = jQuery("#divSearchGridProjectArea").data("kendoGrid").dataSource;
    //    c.pageSize(12);
    //    jQuery("#divSearchGridProjectArea").data("kendoGrid").resize();
    //    alsoResize: ".k-grid-content";
    //});

});

jQuery(function ($) {
    $(document).ready(function () {

        //load kendogrid
        loadProjectAreas();
        loadCODServiceList();

        /*
        $(".k-pager-refresh").trigger('click');
        $('.k-pager-refresh').click(function () 
        {
                alert("Refreshing");         
        });
        */

        //survey tab
        $('#esriCTsearchContainerSurvey').click(function (e) {
            //Tab Color
            $("#esriCTsearchContainerSurvey").css({ background: "lightblue" });
            $("#esriCTsearchContainerProjectArea").css({ background: "#fff" });
            $("#esriCTsearchContainerReview").css({ background: "#fff" });
            $("#esriCTsearchContainerAlert").css({ background: "#fff" });

            //Tab Content
            $("#surveyContent").css({ visibility: "visible", display: "block" });
            $("#projectAreaContent").css({ visibility: "hidden", display: "none" });
            $("#reviewContent").css({ visibility: "hidden", display: "none" });
            $("#reviewResultContent").css({ visibility: "hidden", display: "none" });
            $("#AlertContent").css({ visibility: "hidden", display: "none" });
            $("#projectReviewAreaContent").css({ visibility: "hidden", display: "none" });

            //Other Pages
            $("#projectAreaInfo").css({ visibility: "hidden", display: "none" });
            $("#surveyInfo").css({ visibility: "hidden", display: "none" });
            $("#surveyDraw").css({ visibility: "hidden", display: "none" });
            $("#reviewInfo").css({ visibility: "hidden", display: "none" });
            $("#projectAreaInfoEdit").css({ visibility: "hidden", display: "none" });
        });

        //project area tab
        $('#esriCTsearchContainerProjectArea').click(function (e) {

            //Tab Color
            $("#esriCTsearchContainerProjectArea").css({ background: "lightblue" });
            $("#esriCTsearchContainerReview").css({ background: "#fff" });
            $("#esriCTsearchContainerSurvey").css({ background: "#fff" });
            $("#esriCTsearchContainerAlert").css({ background: "#fff" });

            //Tab Content
            $("#projectAreaContent").css({ visibility: "visible", display: "block" });
            $("#surveyContent").css({ visibility: "hidden", display: "none" });
            $("#reviewContent").css({ visibility: "hidden", display: "none" });
            $("#reviewResultContent").css({ visibility: "hidden", display: "none" });
            $("#AlertContent").css({ visibility: "hidden", display: "none" });
            $("#projectReviewAreaContent").css({ visibility: "hidden", display: "none" });

            //Other Pages
            $("#projectAreaInfo").css({ visibility: "hidden", display: "none" });
            $("#surveyInfo").css({ visibility: "hidden", display: "none" });
            $("#surveyDraw").css({ visibility: "hidden", display: "none" });
            $("#reviewInfo").css({ visibility: "hidden", display: "none" });
            $("#projectAreaInfoEdit").css({ visibility: "hidden", display: "none" });

            //pre-set resize
            //document.getElementById("detailsDiv").style.height = "90%";
            //document.getElementById("detailsDiv").style.width = "30%";
            //document.getElementById("divSearchGridProjectArea").style.height = "621px"; //may change the hardcoded number
            //document.getElementById("divSearchGridProjectArea").style.height = "89%"; //may change the hardcoded number
            //document.getElementById("divSearchGridProjectArea").style.width = "98.5%";
            //$(".k-grid-content").css('height', 560);


            jQuery(function () {
                jQuery("#detailsDiv").draggable();
                jQuery("#detailsDiv").resizable({
                    //handles: 'e, w',
                    minWidth: 400,
                    minHeight: 500,
                    alsoResize: ".k-grid-content",
                    alsoResize: "#divSearchGridProjectArea"
                });
            });

        });



        //Review tab
        $('#esriCTsearchContainerReview').click(function (e) {
            //Tab Color
            $("#esriCTsearchContainerReview").css({ background: "lightblue" });
            $("#esriCTsearchContainerProjectArea").css({ background: "#fff" });
            $("#esriCTsearchContainerSurvey").css({ background: "#fff" });
            $("#esriCTsearchContainerAlert").css({ background: "#fff" });

            //Tab Content
            $("#reviewContent").css({ visibility: "visible", display: "block" });
            $("#surveyContent").css({ visibility: "hidden", display: "none" });
            $("#projectAreaContent").css({ visibility: "hidden", display: "none" });
            $("#reviewResultContent").css({ visibility: "hidden", display: "none" });
            $("#AlertContent").css({ visibility: "hidden", display: "none" });
            $("#projectReviewAreaContent").css({ visibility: "hidden", display: "none" });

            //Other Pages                      
            $("#projectAreaInfo").css({ visibility: "hidden", display: "none" });
            $("#surveyInfo").css({ visibility: "hidden", display: "none" });
            $("#surveyDraw").css({ visibility: "hidden", display: "none" });
            $("#reviewInfo").css({ visibility: "hidden", display: "none" });
            $("#projectAreaInfoEdit").css({ visibility: "hidden", display: "none" });
            $("#resultsGridReview").css({ visibility: "visible", display: "block" });
            $("#divSearchGridReview").css({ visibility: "visible", display: "block" });
            $("input[name=addReview]:radio").removeAttr('checked');

            $("#chooseReviewArea").css({ visibility: "hidden", display: "none" });
            $("#drawReviewArea").css({ visibility: "hidden", display: "none" });
            $("#chooseProjectButton").css({ visibility: "hidden", display: "none" });
            $("#saveReviewButton").css({ visibility: "hidden", display: "none" });


            //pre-set resize
            //document.getElementById("detailsDiv").style.height = "90%";
            //document.getElementById("detailsDiv").style.width = "30%";
            //document.getElementById("divSearchGridReview").style.height = "89%"; //may change the hardcoded number
            //document.getElementById("divSearchGridReview").style.width = "98.5%";
            //$(".k-grid-content").css('height', 560);

            jQuery(function () {
                jQuery("#detailsDiv").draggable();
                jQuery("#detailsDiv").resizable({
                    //handles: 'e, w',
                    minWidth: 400,
                    minHeight: 500,
                    alsoResize: ".k-grid-content",
                    alsoResize: "#divSearchGridReview"
                });
            });

        });


        //test new button
        $('.top').on('click', function () {
            $parent_box = $(this).closest('.box');
            $parent_box.siblings().find('.bottom').hide();
            $parent_box.find('.bottom').toggle();
        });


        //search project area
        $('#searchProjectAreaButton').click(function (e) {
            alert("The search project area function is under construction.");
        });


        //content of project
        function loadProjectAreas(urlCOD) {
            var projectAreasFn = function (urlCOD) {
                var date = new Date();
                sitescript.urlCOD = urlCOD;
                if (!urlCOD) {
                    urlCOD = "https://gistmaps.itos.uga.edu/arcgis/rest/services/COD_External/ZWE_pcode/FeatureServer/3";
                    sitescript.urlCOD = urlCOD;
                }
                $.ajax({
                    type: 'GET',
                    url: sitePath + "/Proxy/Index?" + urlCOD + "/query?where=0%3D0&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&gdbVersion=&historicMoment=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=&resultOffset=&resultRecordCount=&returnTrueCurves=false&sqlFormat=none&f=pjson",
                    dataType: "jsonp",
                    contentType: "application/json",
                    success: function (result) {
                        $("#divSearchGridProjectArea").empty();
                        if (result.Errors != null) {
                            console.log('error');
                            $('#errorsProjectArea').html(result.Errors);
                        } else {
                            var colObj = [];
                            colObj = [
                                {
                                    field: "admin2Name_en",
                                    title: "Admin 2 Name",
                                    template: "<a href=''> #:admin2Name_en# </a>"
                                        + '<img src="' + sitePath + '/Scripts/map/snippet/ProjectTab/zoomin.png"  title="Zoom To Resource" style="cursor: pointer" '
                                        + ' onclick=zoomToProjectItem(#:OBJECTID#) >',
                                    width: 20,
                                    hidden: false

                                },
                                {
                                    field: "admin2Pcode",
                                    title: "Admin 2 PCODE",
                                    width: 20,
                                    hidden: false
                                },
                                {
                                    field: "admin1Name_en",
                                    title: "Admin 1 Name",
                                    width: 20,
                                    hidden: false
                                },
                                {
                                    field: "admin1Pcode",
                                    title: "Admin 1 PCODE",
                                    width: 20,
                                    hidden: false
                                }];
                            if (typeof result.features[0].attributes.admin3Name_en !== 'undefined' || typeof result.features[0].attributes.admin3Name_fr !== 'undefined') {
                                colObj = [
                                    {
                                        field: "admin3Name_en",
                                        title: "Admin 3 Name",
                                        template: "<a href=''> #:admin3Name_en# </a>"
                                            + '<img src="' + sitePath + '/Scripts/map/snippet/ProjectTab/zoomin.png"  title="Zoom To Resource" style="cursor: pointer" '
                                            + ' onclick=zoomToProjectItem(#:OBJECTID#) >',
                                        width: 25,
                                        hidden: false
                                    },
                                    {
                                        field: "admin3Pcode",
                                        title: "Admin 3 PCODE",
                                        width: 20,
                                        hidden: false
                                    },
                                    {
                                        field: "admin2Name_en",
                                        title: "Admin 2 Name",
                                        //  template: "#if(ProjectGridModelStatus=='Complete'){#<a href='javascript:getCompletedDocbyProjName(\"#:ProjectGridModelName#\")'>#:ProjectGridModelStatus#</a>#} else{##:ProjectGridModelStatus##}#",
                                        width: 20,
                                        hidden: false

                                    },
                                    {
                                        field: "admin2Pcode",
                                        title: "Admin 2 PCODE",
                                        width: 20,
                                        hidden: false
                                    },
                                    {
                                        field: "admin1Name_en",
                                        title: "Admin 1 Name",
                                        width: 20,
                                        hidden: false
                                    }
                                ]; 
                            }
                            
                            $("#divSearchGridProjectArea").kendoGrid(
                                {
                                    dataSource: {
                                        data: result,
                                        pageSize: 15,
                                        schema: {
                                            parse: function (data) {
                                                data = result.features;
                                                var enProp = 'admin3Name_en';
                                                for (var i = 0; i < data.length; i++) {
                                                    data[i].OBJECTID = data[i].attributes.OBJECTID;
                                                    data[i].admin0Pcode = data[i].attributes.admin0Pcode;
                                                    data[i].admin1Pcode = data[i].attributes.admin1Pcode;
                                                    data[i].admin2Pcode = data[i].attributes.admin2Pcode;
                                                    data[i].admin0Name_en = data[i].attributes.admin0Name_en;
                                                    data[i].admin1Name_en = data[i].attributes.admin1Name_en;
                                                    data[i].admin2Name_en = data[i].attributes.admin2Name_en;
                                                    if (typeof result.features[0].attributes.admin0Name_fr !== 'undefined') {
                                                        data[i].admin0Name_en = data[i].attributes.admin0Name_fr;
                                                        data[i].admin1Name_en = data[i].attributes.admin1Name_fr;
                                                        data[i].admin2Name_en = data[i].attributes.admin2Name_fr;
                                                    } 
                                                    if (typeof result.features[0].attributes.admin0Name_es !== 'undefined') {
                                                        data[i].admin0Name_en = data[i].attributes.admin0Name_es;
                                                        data[i].admin1Name_en = data[i].attributes.admin1Name_es;
                                                        data[i].admin2Name_en = data[i].attributes.admin2Name_es;
                                                    }
                                                    if (typeof result.features[0].attributes.admin0Name_pt !== 'undefined') {
                                                        data[i].admin0Name_en = data[i].attributes.admin0Name_pt;
                                                        data[i].admin1Name_en = data[i].attributes.admin1Name_pt;
                                                        data[i].admin2Name_en = data[i].attributes.admin2Name_pt;
                                                    } 
                                                    if (enProp in data[i].attributes) {
                                                        data[i].admin3Name_en = data[i].attributes.admin3Name_en;
                                                        data[i].admin3Pcode = data[i].attributes.admin3Pcode;
                                                    }
                                                    if ('admin3Name_fr' in data[i].attributes) {
                                                        data[i].admin0Name_en = data[i].attributes.admin0Name_fr;
                                                        data[i].admin1Name_en = data[i].attributes.admin1Name_fr;
                                                        data[i].admin2Name_en = data[i].attributes.admin2Name_fr;
                                                        data[i].admin3Name_en = data[i].attributes.admin3Name_fr;
                                                        data[i].admin3Pcode = data[i].attributes.admin3Pcode;
                                                    }
                                                }
                                                return data;
                                            }
                                        }
                                    },

                                    excel: {
                                        fileName: "Project_Area" + date.toLocaleDateString() + ".xlsx",
                                        allPages: true,
                                        filterable: true
                                    },

                                    pdf: {
                                        author: "USAID-UNOCHA COD Team",
                                        date: date,
                                        fileName: "Project_Areas_" + date.toLocaleDateString() + ".pdf",
                                        keywords: "USAID-UNOCHA COD Team",
                                        avoidLinks: true,
                                        landscape: false,
                                        margin: {
                                            left: "0.6in",
                                            right: "0.6in",
                                            top: "0.6in",
                                            bottom: "0.6in"
                                        },
                                        scale: 0.8,
                                        subject: "SUBJECT",
                                        title: "TITLE",
                                        paperSize: "A4",
                                        allPages: true
                                    },
                                    columns: colObj,
                                    height: $("#detailsDiv").height() * 0.75,
                                    mobile: true,
                                    clear: true,
                                    groupable: false,
                                    sortable: true,
                                    resizable: true,
                                    width: 'auto',
                                    cache: true,
                                    pageable: {
                                        refresh: true,
                                        pageSizes: false,
                                        buttonCount: 5,
                                        numeric: false,
                                        input: true,
                                        messages: {
                                            display: '{0} - {1} of {2}',
                                            page: ''
                                        }
                                    },
                                    columnMenu: true,
                                    filterable: true

                                });
                            jQuery("#resultsGridProjectArea").css({ visibility: "visible", display: "block", height: "100%" });
                            jQuery("#divSearchGridProjectArea").css({ visibility: "visible", display: "block" });
                            //$(".chosen-select").chosen();

                        }
                    },
                    error: function (data) {
                        console.log('error');
                        $('#errorsProjectArea').html(data.responseText);
                    }
                });
            }
            projectAreasFn();
            sitescript.loadProjectAreas = projectAreasFn;

        }
        function loadCODServiceList() {


            $("#selectionCODCountry").empty();
            $.ajax({
                type: 'GET',
                url: sitePath + "/Proxy/Index?https://gistmaps.itos.uga.edu/arcgis/rest/services/COD_External/?f=pjson",
                dataType: "jsonp",
                contentType: "application/json",
                success: function (result) {
                    var serviceCountryISO = [];

                    for (i = 0; i < result.services.length; i++) {
                        if (JSON.stringify(result.services[i].type).indexOf("FeatureServer") > -1) {
                            var idxName = result.services[i].name.indexOf("/") + 1;
                            var isoName = JSON.stringify(result.services[i].name).substring(JSON.stringify(result.services[i].name).indexOf("/") + 1, JSON.stringify(result.services[i].name).indexOf("/") + 4);
                            var serviceName = result.services[i].name.substring(JSON.stringify(result.services[i].name).indexOf("/"));
                            serviceCountryISO.push(isoName + "," + serviceName);
                        }
                    }
                    for (m = 0; m < serviceCountryISO.length; m++) {
                        var entry = serviceCountryISO[m].split(",");
                        $("#selectionCODCountry").append("<option value='" + entry[1] + "'>" +
                            entry[0] + "</option>");
                    }

                },
                error: function (data) {
                    $('#errorsProjectArea').html(data.responseText);
                }
            });

        }


    });
});
