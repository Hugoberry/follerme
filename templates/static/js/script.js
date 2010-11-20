var map = null;
var step = -1;
var s3bucket_dir = "http://s3.foller.me";

jQuery(document).ready(function(){
	
	jQuery(".twitter_input").focus(function(){
		if (this.value == "type in a Twitter name")
			this.value = "";
	});
	
	jQuery(".twitter_input").blur(function(){
		if (this.value == "")
			this.value = "type in a Twitter name";
	});
	
	jQuery(".oauth_follow_link").click(function() {
		jQuery(".oauth_follow").hide();
		jQuery(".oauth_follow_loading").show();
		
		jQuery.post(fmData.request, "request=oauth&screen_name="+fmData.screen_name, function(data, textStatus) {
			if (data.substr(0,3) == "200")
			{
				jQuery(".oauth_follow_text").html(data.substr(4));
				jQuery(".oauth_follow_loading").hide();
				jQuery(".oauth_follow").show();
			}
			else
			{
				jQuery(".oauth_follow_text").html("An error occoured!");
				jQuery(".oauth_follow_loading").hide();
				jQuery(".oauth_follow").show();
			}
		});
		return false;
	});
	
	jQuery("#tweet_profile").click(function() {
		jQuery(".oauth_follow").hide();
		jQuery(".oauth_follow_loading").show();
		
		jQuery.post(fmData.request, "request=oauth_tweet&screen_name="+fmData.screen_name, function(data, textStatus) {
			if (data.substr(0,3) == "200")
			{
				jQuery(".oauth_follow_loading").hide();
				jQuery(".oauth_follow").show();
				jQuery("span.tweet_profile").html("Tweeted!");
			}
			else
			{
				jQuery(".oauth_follow_loading").hide();
				jQuery(".oauth_follow").show();
				alert("An error occoured!");
			}
		});
		return false;
	});
	
	jQuery(".collapse").click(function() {
		var cookie_name = "fm_" + jQuery(this).attr("href").substr(1) + "_hidden";
		var parent = this;
		var obj = jQuery(this).parents(".rec_tweet").find(".the_tags");
		jQuery(obj).slideToggle("slow", function() {
			if (jQuery(obj).is(':visible'))
			{
				jQuery.cookie(cookie_name, null);
				jQuery(parent).html("Collapse");
			}
			else
			{
				jQuery.cookie(cookie_name, "yes");
				jQuery(parent).html("Expand");
			}
		});
		return false;
	});
});

function getMap(username) {
	jQuery.post('/ajax/gmap/', 'profile=' + username, function(data, textStatus) {
		jQuery('.gmaps').html(data);
		jQuery('#map_container').fadeTo(2000, 1);
	});
}

/*function follerMeAction(action, param1, param2) {
	if (action == "maps") {
		if (!param2) param2 = "no";
		jQuery.post(fmData.request, "request=maps&screen_name="+param1+"&location="+fmData.location, function(data, textStatus) {
			jQuery(".gmaps").html(data);
			jQuery("#map_container").fadeTo(2000, 1);
		});
	}
	
	if (action == "recent_update") {
		jQuery.post(fmData.request, "request=recent_update", function(data, textStatus) {
			jQuery("#recent_queries").fadeTo(1000, 0.01, function() {
				jQuery("#recent_queries").html(data);
				jQuery("#recent_queries").fadeTo(3000, 1);
				setTimeout("follerMeAction('recent_update');", 10000);
			});
		});
	}
}*/

function showPoint(lat, lng, html, self) { 
    point = new GLatLng(lat, lng);
    var marker = createMarker(point, html, self); 
    map.addOverlay(marker); 
}

function createMarker(point, html, self) {
	var dir = (self) ? "self/" : "";
	// Create a lettered icon for this point using our icon class
	var myIcon = new GIcon();
	myIcon.image = '/static/images/gmaps/' + dir + 'image.png';
	myIcon.printImage = '/static/images/gmaps/' + dir + 'printImage.gif';
	myIcon.mozPrintImage = '/static/images/gmaps/' + dir + 'mozPrintImage.gif';
	myIcon.iconSize = new GSize(25,28);
	myIcon.shadow = '/static/images/gmaps/' + dir + 'shadow.png';
	myIcon.transparent = '/static/images/gmaps/' + dir + 'transparent.png';
	myIcon.shadowSize = new GSize(39,28);
	myIcon.printShadow = '/static/images/gmaps/' + dir + 'printShadow.gif';
	myIcon.iconAnchor = new GPoint(13,28);
	myIcon.infoWindowAnchor = new GPoint(13,0);
	myIcon.imageMap = [22,0,22,1,23,2,23,3,23,4,23,5,23,6,23,7,23,8,23,9,23,10,23,11,23,12,23,13,23,14,23,15,23,16,23,17,23,18,22,19,21,20,12,21,11,22,10,23,9,24,8,25,23,26,22,27,2,27,1,26,8,25,8,24,8,23,9,22,9,21,2,20,0,19,0,18,0,17,0,16,0,15,0,14,0,13,0,12,0,11,0,10,0,9,0,8,0,7,0,6,0,5,0,4,0,3,0,2,0,1,1,0];
	
	// Set up our GMarkerOptions object
	markerOptions = { icon:myIcon };
	var marker = new GMarker(point, markerOptions);
	
	GEvent.addListener(marker, "click", function() {
	marker.openInfoWindowHtml(html);
	});
	
	return marker;
}
