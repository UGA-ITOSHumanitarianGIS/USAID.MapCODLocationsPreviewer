define([
	'dojo/_base/declare',
	'esri/layers/FeatureLayer',
	'esri/InfoTemplate'
], function(
	declare,
	FeatureLayer,
	InfoTemplate
) {
	return declare([FeatureLayer], {
		/**
		 * Creates a new DawgMapFeatureLayer.
		 * 
		 * @classdesc Wrapper class for Esri FeatureLayers. Provides consistency in the framework.
		 * 
		 * @memberof layer
		 * @constructor DawgMapFeatureLayer
		 * @param {String} url - Url to the layer
		 * @param {Object} config - Config object, same parameters as the FeatureLayer config
		 * @returns {DawgMapFeatureLayer} The DawgMapFeatureLayer
		 */
		constructor : function(url, config) {
			this.name = arguments[1].name ? arguments[1].name : "";
                        this.visible = arguments[1].visible;
                        this.setDefinitionExpression(config.setDefinitionExpression);
			if(typeof arguments[1].infoTemplate === "object") {
				if(typeof arguments[1].infoTemplate.title === "string"
						&& typeof arguments[1].infoTemplate.content === "string") {
					this.infoTemplate = new InfoTemplate(arguments[1].infoTemplate)
                } else {
					var title = arguments[1].infoTemplate.title;
					var content = arguments[1].infoTemplate.content;
					if (arguments[1].id == 'Project_Survey') {
                        title = "Projects and Surveys";
                        content = '<b>Name</b>: ${NAME}' +
                            '<br><b>Id:</b><a href="#" onclick=\'projectDetailedInfo(${ProjectID})\'>${ProjectID}</a>' +
                            '<br><b>Created by:</b> ${USAID_UserName}';
                    }
                    if (arguments[1].name == 'Reviews') {
                        title = "Reviews";
                        content = '<b>Name</b>: ${Review_Name}' +
                            '<br><b>Id:</b><a href="#" onclick=\'loadReviewResult(${ReviewID})\'>${USAID_ID}</a>' +
                            '<br><b>Created by:</b> ${Review_Creation_User}' +
                            '<br><b>Project ID:</b> ${ProjectID}';
                    }
					this.infoTemplate = new InfoTemplate(title,content);
				}
			}
                        this.on("selection-complete", arguments[1].selectionComplete ? arguments[1].selectionComplete : this.selectionComplete);
		},
                
                selectionComplete : function() {
                }
	});
});