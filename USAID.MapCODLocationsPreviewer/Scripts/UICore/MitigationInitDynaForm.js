jQuery.noConflict();


jQuery(function ($) {
    $(document).ready(function () {
        if (Modernizr.addTest('localstorage')) {
            //lets use localstorage
        }
    });
});
function searchGMISSH(idList, layer) {
    jQuery(function ($) {
        if (layer == 'BLLIPBuilding') {
            var layerUrl = '../Maps/selectResults.html';

            $("#entry").empty();
            $("#resultsGrid").empty();

            if ($("#entry").is(':empty')) {

                $("#entry").load(layerUrl, function () {
                    $("#layerTitle").text("State Owned Buildings (BLLIP source)");
                    slideOutPane();
                    $("#ui-pane-search-titlebar").attr('style', 'width:998px;');
                    $("#detailsContentDiv").attr('style', 'width:1000px;');
                    $("#detailsDiv").css({ visibility: "visible", display: "block" });
                    $("#divSearchGrid").kendoGrid({
                        dataSource: {
                            data: idList.Data,
                            pageSize: 20
                        },
                        transport: {
                            read: function (idList) { }
                        },
                        clear: true,
                        groupable: false,
                        sortable: true,
                        resizable: true,
                        width: 1000,
                        cache: true,
                        pageable: {
                            refresh: false,
                            pageSizes: false,
                            buttonCount: 4,
                            numeric: false,
                            input: true,
                            messages: {
                                display: '{0} - {1} of {2}',
                                page: ''
                            }
                        },
                        columnMenu: true,
                        filterable: true,
                        resizable: true,
                        columns: [
                            {
                                field: "Building_Name",
                                title: "Name",
                                hidden: false,
                                width: 100
                            },
                            {
                                field: "Address",
                                title: "Address",
                                hidden: false,
                                width: 100
                            },
                            {
                                field: "City",
                                title: "City",
                                hidden: false,
                                width: 60
                            },
                            {
                                field: "Coords",
                                title: "Geog. Coordinates",
                                hidden: false,
                                width: 60
                            },
                            {
                                field: "Location",
                                title: "Location",
                                hidden: false,
                                width: 40
                            },
                            {
                                field: "Sublocation",
                                title: "Sublocation",
                                hidden: false,
                                width: 40
                            },
                            {
                                field: "BusinessInterrupt",
                                title: "Business Interrupt",
                                hidden: false,
                                width: 20
                            },
                            {
                                field: "Numfloors",
                                title: "Floors",
                                hidden: false,
                                width: 20
                            },
                            {
                                field: "Squarefeet",
                                title: "Sq. Feet",
                                hidden: false,
                                width: 20
                            },
                            {
                                field: "rmsOccupancy",
                                title: "RMS Occupancy",
                                hidden: false,
                                width: 20
                            },
                            {
                                field: "yearConstructed",
                                title: "Construction Year",
                                hidden: false,
                                width: 20
                            },
                            {
                                field: "FloodPlain",
                                title: "Flood Plain",
                                hidden: false,
                                width: 20
                            },
                            {
                                field: "InsuredValue",
                                title: "Insured Value",
                                format: "{0:c2}",
                                hidden: false,
                                width: 40
                            },
                            {
                                field: "ContentsValue",
                                title: "Contents Value",
                                format: "{0:c2}",
                                hidden: false,
                                width: 40
                            },
                            {
                                field: "AppraisalDate",
                                title: "Appraisal Date",
                                template: "#= kendo.toString(new Date(AppraisalDate), 'yyyy-MM-dd') #",
                                hidden: false,
                                width: 40
                            },
                            {
                                field: "AppraisalValue",
                                title: "Appraisal Value",
                                format: "{0:c2}",
                                hidden: false,
                                width: 40
                            },
                            {
                                field: "Score",
                                title: "Score",
                                hidden: false,
                                width: 20
                            }

                        ]
                    });
                    $("#resultsGrid").css({ visibility: "visible", display: "block" });
                    $("#divSearchGrid").css({ visibility: "visible", display: "block" });

                });
            }

            return;
        }
    });

}
function searchGMIS(idList, layer, county) {
    jQuery(function ($) {
        if (layer == 'BLLIPBuilding') {
            var layerUrl = '../Maps/selectResults.html';
            
            $("#entry").empty();
            $("#resultsGrid").empty();
  
            if ($("#entry").is(':empty')) {

                $("#entry").load(layerUrl, function () {
                    $("#layerTitle").text("State Owned Buildings (BLLIP source)");
                    slideOutPane();
                    $("#ui-pane-search-titlebar").attr('style', 'width:998px;');
                    $("#detailsContentDiv").attr('style', 'width:1000px;');
                    $("#detailsDiv").css({ visibility: "visible", display: "block" });
                    $("#divSearchGrid").kendoGrid({
                        dataSource: {
                            data: idList.Data,
                            pageSize: 20
                        },
                        transport: {
                            read: function (idList) { }
                        },
                        clear: true,
                        groupable: false,
                        sortable: true,
                        resizable: true,
                        width: 1000,
                        cache: true,
                        pageable: {
                            refresh: false,
                            pageSizes: false,
                            buttonCount: 4,
                            numeric: false,
                            input: true,
                            messages: {
                                display: '{0} - {1} of {2}',
                                page: ''
                            }
                        },
                        columnMenu: true,
                        filterable: true,
                        resizable: true,
                        columns: [
                            {
                                field: "Building_Name",
                                title: "Name",
                                hidden: false,
                                width: 100
                            },
                            {
                                field: "Address",
                                title: "Address",
                                hidden: false,
                                width: 100
                            },
                            {
                                field: "City",
                                title: "City",
                                hidden: false,
                                width: 60
                            },
                            {
                                field: "Coords",
                                title: "Geog. Coordinates",
                                hidden: false,
                                width: 60
                            },
                            {
                                field: "Location",
                                title: "Location",
                                hidden: false,
                                width: 40
                            },
                            {
                                field: "Sublocation",
                                title: "Sublocation",
                                hidden: false,
                                width: 40
                            },
                            {
                                field: "BusinessInterrupt",
                                title: "Business Interrupt",
                                hidden: false,
                                width: 20
                            },                    
                            {
                                field: "Numfloors",
                                title: "Floors",
                                hidden: false,
                                width: 20
                            },
                            {
                                field: "Squarefeet",
                                title: "Sq. Feet",
                                hidden: false,
                                width: 20
                            },
                            {
                                field: "rmsOccupancy",
                                title: "RMS Occupancy",
                                hidden: false,
                                width: 20
                            },
                            {
                                field: "yearConstructed",
                                title: "Construction Year",
                                hidden: false,
                                width: 20
                            },
                            {
                                field: "FloodPlain",
                                title: "Flood Plain",
                                hidden: false,
                                width: 20
                            },
                            {
                                field: "InsuredValue",
                                title: "Insured Value",
                                format: "{0:c2}",
                                hidden: false,
                                width: 40
                            },
                            {
                                field: "ContentsValue",
                                title: "Contents Value",
                                format: "{0:c2}",
                                hidden: false,
                                width: 40
                            },
                            {
                                field: "AppraisalDate",
                                title: "Appraisal Date",
                                template: "#= kendo.toString(new Date(AppraisalDate), 'yyyy-MM-dd') #",
                                hidden: false,
                                width: 40
                            },
                            {
                                field: "AppraisalValue",
                                title: "Appraisal Value",
                                format: "{0:c2}",
                                hidden: false,
                                width: 40
                            }

                        ]
                    });
                    $("#resultsGrid").css({ visibility: "visible", display: "block" });
                    $("#divSearchGrid").css({ visibility: "visible", display: "block" });

                });
            }
           
            return;
        }
        var layerName = 'Mitigated Property';
        var eTemplate = '<img src= "../Images/btn_edit.gif" alt= "Edit" title = "Edit" style = "cursor:pointer" onclick="window.parent.mapFrame.SimpleEdit(#: EditId#);">';
        var layerUrl = '../MitigatedProperty/_SearchResultsOptions';

        if (layer.indexOf("Facilit") > -1) {
            layerName = 'Facilities';
            layerUrl = '../Facility/_SearchResultsOptions';
            eTemplate = '<img src= "../Images/btn_edit.gif" alt= "Edit" title = "Edit" style = "cursor:pointer" onclick="window.parent.mapFrame.SimpleFacilityEdit(#: EditId#);">';
        }

        $("#entry").empty();
        $("#resultsGrid").empty();
        var facilityForm = {};
        facilityForm.Facilities = "";
        facilityForm.FilterCriteria = 0;
        facilityForm.searchItem = "";
        facilityForm.ExampleInput = "";
        facilityForm.searchLevel = "";
        facilityForm.savedIds = "";
        facilityForm.addToResults = "";
        facilityForm.selectFromResults = "";
        facilityForm.idList = [];
        if (idList != undefined) {
            for (var i = 0; i < idList.length; i++) {
                facilityForm.idList[i] = idList[i];
            }
        }
        if (county != undefined) {
            facilityForm.FilterCriteria = county;
            facilityForm.Facilities = 'County';
        }

        if ($("#entry").is(':empty')) {
            $("#entry").load(layerUrl);
            $("#detailsContentDiv").attr('style', 'width:460px;');
            $("#detailsDiv").css({ visibility: "visible", display: "block" });
            slideOutPane();
            if (idList == "") {
                $("#entry").load(layerUrl);
            } else {
                $.ajax({
                    type: 'POST',
                    data: facilityForm,
                    url: layerUrl,
                    context: $("#resultsGrid"),
                    success: function (data) {
                        $("#resultsGrid").append('<table id="divSearchGrid" style="height:600px; top:50px;">');
                        $("#divSearchGrid").html(data);
                        $("#savedIds").val(data.Data[data.Total - 1].intarray);
                        $("#divSearchGrid").kendoGrid({
                            dataSource: {
                                data: data.Data,
                                pageSize: 20
                            },
                            transport: {
                                read: function (data) { }
                            },
                            clear: true,
                            groupable: false,
                            sortable: true,
                            resizable: false,
                            width: 455,
                            cache: true,
                            pageable: {
                                refresh: false,
                                pageSizes: false,
                                buttonCount: 4,
                                numeric: false,
                                input: true,
                                messages: {
                                    display: '{0} - {1} of {2}',
                                    page: ''
                                }
                            },
                            columnMenu: true,
                            filterable: true,
                            columns: [
                                {
                                    field: "Name",
                                    title: "Name",
                                    hidden: false,
                                    width: 178
                                },
                                {
                                    field: "Address",
                                    title: "Address",
                                    hidden: false,
                                    width: 178
                                },
                                {
                                    field: "ZoomTo",
                                    title: "ZoomTo",
                                    width: 45,
                                    template: '<img src="../Images/zoom_in.png" alt="Zoom To Resource" title="Zoom To Resource" style="cursor: pointer" onclick="window.parent.mapFrame.SimpleZoomTo(#: ZoomTo#);">',
                                    filterable: false,
                                    sortable: false,
                                    menu: false,
                                    hidden: false
                                },
                                {
                                    field: "EditId",
                                    title: "Edit",
                                    width: 45,
                                    template: eTemplate,
                                    hidden: false
                                }
                            ]
                        });
                        $("#resultsGrid").css({ visibility: "visible", display: "block" });
                        $("#divSearchGrid").css({ visibility: "visible", display: "block" });
                        console.log(data.Data);
                        window.parent.mapFrame.renderSelected(data.Data, layerName);
                        $("#divRefineSearchOptions").css({ visibility: "visible", display: "block" });
                        $("#refineSearch").css({ visibility: "visible", display: "block" });
                        $("#submitSearch").val('Clear Query');
                    },
                    error: function (data) {
                        console.log("errors");
                        $('#errors').html(data.responseText);
                    }
                });
            }
            
        $("#detailsContentDiv").attr('style', 'width:460px;');
        $("#detailsDiv").css({ visibility: "visible", display: "block" });
        slideOutPane();
        }
    });
}


function resultsGMIS(ids, layer) {
    jQuery(function ($) {
        slideInPane();
        var computedHeight = $("#detailsDiv").height() - 290;
        console.log(computedHeight);
        var pageOnHeight = Math.floor((computedHeight - 150) / 50);

        $("#entry").css({ visibility: "visible", display: "block" });
        $("#resultsGrid").css({
            height: computedHeight - 100
        });

        var data = [{ "Name": "test", "Address": "2 Test street", "MessageReturnResult": null, "Total": 1, "AggregateResults": null, "Errors": null }];
        var datasource = new kendo.data.DataSource({
            data: data
        });
        $("#detailsFinalResults").css({ visibility: "visible", display: "block" });


        slideOutPane();
        return false;
    });
}

function prepEdit(e, layername, savedIds) {
    jQuery(function ($) {
        $("#detailsDiv").animate({ left: "-690px" }, 500);
        $("#entry").empty();
        $("#detailsDiv").animate({ left: "0px" }, 500);
        $("#detailsContentDiv").attr('style', 'width:690px; height:1100px');
        if (layername.indexOf('Facilities') > -1) {
            $("#entry").load('../Facility/Edit/' + e);
        } else {
            $("#entry").load('../MitigatedProperty/Edit/' + e, function () {
                $("#savedIds").text(savedIds);
            });
        }
    });

}

function slideOutResultsPane() {
    jQuery(function ($) {
        $("#resultsDiv").animate({ bottom: "40px" }, 500);
    });
}

function slideInResultsPane() {
    jQuery(function ($) {
        $("#resultsDiv").animate({ bottom: "-460px" }, 500);
        $("#resultsDiv").css({ visibility: "hidden", display: "non" });
    });
}
function slideOutPane() {
    jQuery(function ($) {
        $("#detailsDiv").animate({ left: "0px" }, 500);
    });
}

function slideInPane() {
    jQuery(function ($) {
        var divWidth = $("#detailsContentDiv").width();
        $("#detailsDiv").animate({ left: -divWidth - 40 }, 500);
        document.getElementById('address').disabled = false;
    });

}
function slideInDetailsPane() {
    jQuery(function ($) {
        var divWidth = $("#column-center").width();
        $("#detailsDiv").animate({ left: -divWidth }, 500);
        $("#column-left").animate({ left: "220px" }, 500);
    });

}
function slideOutDetailsPane() {
    jQuery(function ($) {
        $("#column-center").animate({ left: "220px" }, 500);
        $("#detailsDiv").animate({ left: "0px" }, 500);
        $("#column-left").animate({ left: "0px" }, 500);
    });
}

    jQuery(function ($) {

        $("#AppMenuMain").menu({ position: { my: 'left top', at: "left bottom" } });
        $("#DefaultMenuMain").menu({ position: { my: 'left top', at: "left bottom" } });
  
        $(".NewFacility a").click(function (e) {
            e.preventDefault();
            addFac();

        });
        $(".NewMitigatedProperty a").click(function (e) {
            e.preventDefault();
            addMit();

        });
        $(".SearchAddress").click(function (e) {
            e.preventDefault();
            searchAddress($("#address").val());

        });
        $(".SearchArea").click(function (e) {
            e.preventDefault();
            searchAddress($("#address").val());

        });
        $(".SearchMitigatedProperty").click(function (e) {
            e.preventDefault();
            searchMitigatedPropertyDetails();

        });

        $(".SearchFacility").click(function (e) {
            e.preventDefault();
            searchFacilityDetails();

        });
        $(".ReportFacility").click(function (e) {
            e.preventDefault();
            reportFacilityDetails();

        });
        $(".ReportStateHolding").click(function (e) {
            e.preventDefault();
            reportStateHoldingDetails();

        });
        $(".closePane").click(function (e) {
            e.preventDefault();
            slideInPane();

        });
        $(".Import").click(function (e) {
            e.preventDefault();
            importfunc();

        });
        $(".SelectMitigatedProperty a").click(function (e) {
            e.preventDefault();
            mapSelect('Mitigated Property');
        });
        $(".SelectFacility a").click(function (e) {
            e.preventDefault();
            mapSelect('Facility');
        });
        $(".SelectBLLIPBuilding a").click(function (e) {
            e.preventDefault();
            mapSelect('BLLIPBuilding');
        });
        
    function importfunc() {
        slideInPane();
        $("#entry").empty();
        $.ajax({
            url: "../Home/Import",
            context: $("#entry")
        }).success(function (data) {
            $("#entry").html(data);
            //Changed detailsContentDiv width from 460 to 690, added ui-pane-search-titlebar -Nilayan
            $("#detailsContentDiv").attr('style', 'width:690px;');
            $("#detailsContentDiv").attr('style', 'height:690px;');
            $("#ui-pane-search-titlebar").attr('style', 'width:690px;');
            $("#detailsDiv").css({ visibility: "visible", display: "block" });
            slideOutPane();
        });

        /*
            if ($("#entry").is(':empty')) {
                $("#entry").load('../Home/Import/', function () {
                    $("#detailsDiv").css({ height: "auto" });
                });
            }
            $("#entry").css({ visibility: "visible", display: "block" });
            $("#detailsContentDiv").attr('style', 'width:690px;');
            */
           // slideOutPane();
           // return false;
        }

    function addFac() {
        slideInPane();
        $("#entry").empty();
        if ($("#entry").is(':empty')) {
            $("#entry").load('../Facility/FacilityOptionsAdd/', function () {
                $("#detailsDiv").css({ height: "auto" });
                var divWidth = $("#column-center").width();
                $("#detailsDiv").animate({ left: -divWidth }, 500);
                $("#column-left").animate({ left: "220px" }, 500);
            });
        }
        $("#entry").css({ visibility: "visible", display: "block" });
        $("#detailsContentDiv").attr('style', 'width:690px;');
   
        
        return false;
    }

    function addMit() {
            slideInPane();
            $("#entry").empty();
            if ($("#entry").is(':empty')) {
                $("#entry").load('../MitigatedProperty/MitigationActionOptionsAdd/', function () {
                    $("#detailsDiv").css({ height: "1100px" });
                });
            }
            $("#entry").css({ visibility: "visible", display: "block" });
            $("#detailsContentDiv").attr('style', 'width:690px;');
            slideOutPane();
            return false;

    }

    function searchMitigatedPropertyDetails() {

        slideInPane();
        $("#entry").empty();
        $.ajax({
            url: "../MitigatedProperty/_SearchResultsOptions",
            context: $("#entry")
        }).success(function (data) {
            $("#entry").html(data);
            //Changed detailsContentDiv width from 460 to 690, added ui-pane-search-titlebar -Nilayan
            $("#detailsContentDiv").attr('style', 'width:690px;');
            $("#ui-pane-search-titlebar").attr('style', 'width:690px;');
            $("#detailsDiv").css({ visibility: "visible", display: "block" });
            slideOutPane();
        });
    }

        
    $("#ImportForm").submit(function (event) {
        if ($("#file").val() == '') {
            alert("Please select a file to upload");
            return false;
        }

        var validExtensions = ['xls'];
        var fileName = $("#file").val();
        var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
        if ($.inArray(fileNameExt, validExtensions) == -1) {
            alert("Invalid file type");
            return false;
        }

        event.preventDefault();

        var form = $('ImportForm').serialize();
        var data = new FormData();
        data.append('file', $('#file')[0].files[0]);
        data.append('county', $('#County :selected').text());
        $("#entry").empty();
        
        $.ajax({
            type: 'POST',
            data: data,
            url: "../Home/Import",
            enctype: 'multipart/form-data',
            contentType: false,
            processData: false,
            context: $("#resultsGrid"),
            success: function (data) {
                if (data.Errors != null || data.Total == 0) {
                    if (data.Errors != null) {
                        $('#errors').html(data.Errors);
                    } else {
                        $('#errors').html("Count: " + data.Total);
                    }
                } else {
                    $("#entry").html(data);
                    $("#detailsContentDiv").attr('style', 'width:690px;');
                    $("#ui-pane-search-titlebar").attr('style', 'width:690px;');
                    $("#detailsDiv").css({ visibility: "visible", display: "block" });
                }
            },
            error: function (data) {
                $('#errors').html(data.responseText);
            }
        })
        return false;
    })


    function searchFacilityDetails() {
        slideInPane();
        $("#entry").empty();
        if ($("#entry").is(':empty')) {
            $("#entry").load('../Facility/_SearchResultsOptions', function () {
                $("#detailsDiv").css({ height: "auto" });
            });
            $("#detailsContentDiv").attr('style', 'width:460px;');
            $("#detailsDiv").css({ visibility: "visible", display: "block" });
            slideOutPane();
        }
        $("#detailsContentDiv").attr('style', 'width:460px;');
        $("#detailsDiv").css({ visibility: "visible", display: "block" });
        slideOutPane();

    }
    function reportFacilityDetails(selected) {
        jQuery(function ($) {
            
            slideInPane();
            $("#entry").empty();
            if ($("#entry").is(':empty')) {
                if (selected != undefined) {

                    $("#entry").load('../Facility/_ReportResultsOptions?selected=1', function (e) {
                        return false;
                    });
                   
                } else {
                    $("#entry").load('../Facility/_ReportResultsOptions', function (e) {
                    });
                }
            }
            $("#detailsContentDiv").attr('style', 'width:460px;');
            $("#detailsDiv").css({ visibility: "visible", display: "block" });
            $("#detailsDiv").css({ height: "180px" });
            slideOutPane();
            return false;
        });

    }

    function reportStateHoldingDetails() {
        jQuery(function ($) {
            slideInPane();
            $("#entry").empty();
            $("#detailsDiv").css({ height: "180px" });
            if ($("#entry").is(':empty')) {
                $("#entry").load('../Location/LocationOptionsStateHoldings', function () {
                    $("#layerTitle").text("State Holdings County Report");  
                });
            }
            $("#detailsContentDiv").attr('style', 'width:460px;');
            $("#detailsDiv").css({ visibility: "visible", display: "block" });
            
            slideOutPane();
        });

    }

    function searchAddress(sTxt) {
        document.getElementById('mapFrame').contentWindow.locate(sTxt);
    }
    function mapSelect(targetText) {
        console.log(targetText);
        document.getElementById('mapFrame').contentWindow.toggleMoreToolbar(targetText);
    }
  
});



function toggleVisibility(theElem, linkElem, txtContent) {
    if (document.getElementById(theElem).style.display == 'none') {
        document.getElementById(linkElem).textContent = "Hide " + txtContent;
        document.getElementById(theElem).style.display = 'block';
    } else {
        document.getElementById(linkElem).textContent = "Show " + txtContent;
        document.getElementById(theElem).style.display = 'none';
    }

}

