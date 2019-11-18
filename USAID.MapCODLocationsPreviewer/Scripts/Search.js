Search = function(dawgMap) {
	var map = dawgMap;
	require([
		"esri/dijit/Search",
		"esri/geometry/Extent"
	], function (Search, Extent) {
		
		var extent = new Extent({
			"xmin": -9553433.1565131,  
			"ymin": 3542889.56432512,  
			"xmax": -8993302.4684646,  
			"ymax": 4216758.46848445,  
			"spatialReference": {  
				"wkid": 102100  
			}  
		});
		
		var search = new Search({
			map: map.map
		},"search");
		
		search.sources[0].searchExtent = extent;
		
		search.startup();
		
		search.on('search-results', function(e){
			console.log(e)
			if(e.results == null)
				return;
			var length = e.results[0].length;
			found = false;
			var i = 0;
			while(!found && i < length) {
				if(e.results[0][i] != null) {
					result = e.results[0][i];
					geometry = result.feature.geometry;
					var x = geometry.x;
					var y = geometry.y;
					if(validateLocation(x,y)) {
						console.log(result)
						search.select(result)
						found = true;
					}
				} 				
				i++;
			}
		});
	});

}

var found = false;

function foundData(data) {
	if(data.count >= 1)
		found = true;
}

function validateLocation(x,y) {
	var validated = 0
	var parms = 'geometry=' + x + ',' + y + 
				'&geometryType=esriGeometryPoint' + //assuming point
				'&inSR=' + 102100 + 				//assuming spatialReference
				'&spatialRel=esriSpatialRelWithin' +//assuming within
				'&returnCountOnly=true' +
				'&f=json';
	var count = JSON.parse($.ajax({
		type: 'GET',
		contentType: 'application/json',
		url: 'https://maps.itos.uga.edu/arcgis/rest/services/FrameWork/Boundaries/MapServer/6/query?' + parms,
		dataType: 'JSON',
		async: false
	}).responseText).count;
	if(count >= 1)
		return true
	return false
}
//     https://maps.itos.uga.edu/arcgis/rest/services/FrameWork/Boundaries/MapServer/6/query?geometry=-9281589.41,4023559.65&geometryType=esriGeometryPoint&inSR=102100&spatialRel=esriSpatialRelWithin&returnGeometry=false
/*

	
function validateLatLon(location) {
	var validated = 0;
	var def = jQuery.Deferred();
	
	jQuery(function ($) {
		
		validated = 0;
		
		if (location == null || location == undefined)
		{
			validated = 0;
			return;
		}
		
		var parms = 
				'objectIds=&where=&time=&geometry=' + x + '%2C' + y + '&geometryType=esriGeometryPoint
				&inSR=&spatialRel=esriSpatialRelWithin 
				&returnGeometry=false
				&outSR=' + spatialReference + '
				&returnCountOnly=false
				&returnIdsOnly=false
				&f=json';
		$.ajax({
			type: 'GET',
			contentType: 'application/json',
			url: 'https://maps.itos.uga.edu/arcgis/rest/services/FrameWork/Boundaries/MapServer/6/query?' + parms,
			dataType: 'JSON',
			success: function (data) {
				if (data.features[0] == undefined) {
					alert('Location not allowed');
					window.parent.mapFrame.map.graphics.clear();
					$("#Latitude").val('');
					$("#Longitude").val('');
					
					validated = 0;
				} else {
					$("#CountyList").val(data.features[0].attributes.CNTYIDFP).attr("selected", "selected").change();
					if (window.parent.document.getElementById("AllowedCounties") != null) {
						var ac = window.parent.document.getElementById("AllowedCounties").innerHTML;

						if (ac != "") {
							var acChecked = window.parent.mapFrame.qcFips(ac).join(",");
							var acChecked = acChecked.replace(/'/g, "");
							var s = data.features[0].attributes.CNTYIDFP;
							if (acChecked.indexOf(s) == -1) {
								alert('Location not allowed');
								window.parent.mapFrame.map.graphics.clear();
								$("#Latitude").val('');
								$("#Longitude").val('');
								window.parent.mapFrame.disconnectMapClickEvent();
								window.parent.mapFrame.createMapClickEvent();
								
								validated = 0;
							} else {validated = 1;}
						}
					}
				}
			   
			}
		}).done(function (data) {
			console.log(data)
			def.resolve(validated);
			console.log('resolved');
			return def.promise();
		});

	});
	
	};
};






*/