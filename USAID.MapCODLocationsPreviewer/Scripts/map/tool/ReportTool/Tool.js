define([
        'dojo/_base/declare',
        'dojo/_base/window',
        'dojo/dom-construct',
        'dawgmap/tool/base/BasePanelTool',
        'dojo/on',
        'dijit/Dialog',
        'dijit/form/TextBox',
        'dijit/form/Button',
        'dijit/registry'
], function (declare, win, domConstruct, BasePanelTool, on, Dialog, TextBox, Button, registry) {
    return declare([BasePanelTool], {
        name: "ReportTool",
        label: "View/Export Report",
        config: {
            reportName : "",
            reportLink : "",
        },
        startup: function () {
            var that = this;
            this.inherited(arguments); // calls parent class' startup method
            this.createViewReportWindow();
            var div = dojo.query("#ReportContainer");
            on(div[0], "click", function () {
                div[0].innerHTML = "Clicked now!";
                that.createDivElement();
            });
        },
        
        createDivElement: function () {     
            this.showViewReportWindow();
        },

        createViewReportWindow: function () {
            var str = "<div class=\"dijitDialogPaneContentArea\">";
            str += "<div id=\"viewReportWindow\" style=\"display: block;\">";
            str += "<iframe id=\"frame\" src=\"";
            str += this.config.reportLink;
            str += "\" width=\"800\" height=\"650\" scrolling=\"no\"></iframe>";
            str += "</div>";
            str += "</div>";
            if (!dijit.byId(this.config.reportName))
            var dlg = new Dialog({
                id: this.config.reportName,
                title: "GHNARGIS Report",
                style: "border:1px solid #b7b7b7; background:#fff; padding:8px; margin:0 auto; Display: none",
                content: str
            });
        },

        showViewReportWindow: function () {
            dijit.byId(this.config.reportName).show();
        }
    });
});