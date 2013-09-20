// RequireJS Module for Geolocation with polyfill
//
define  (['jquery', 'polyfiller'],
function ( $      ){
	
	$.webshims.setOptions('geolocation', {
		confirmText: 'Talescape needs to know your GPS location. Is that OK?'
	});
});
