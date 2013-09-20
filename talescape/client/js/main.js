//// RequireJS Configuration
//
require.config({
	paths: {
		'modernizr'  : 'lib/modernizr/modernizr',
		'polyfiller' : 'lib/webshim/src/polyfiller',
		'domReady'   : 'lib/requirejs-domready/domReady',
		'async'      : 'lib/requirejs-plugins/src/async',
		'jquery'     : 'lib/jquery/jquery',
		'angular'    : 'lib/angular/angular',
		'ng-ui/map'  : 'lib/angular-ui-map/src/map',
		'ng-ui/event': 'lib/angular-ui-utils/modules/event/event'
	},
	shim: {
		'polyfiller' : ['jquery', 'modernizr'],
		'ng-ui/map'  : ['angular', 'ng-ui/event', 'gmaps'],
		'ng-ui/event': ['angular'],
		'angular'    : { exports: 'angular' }
	}
});

//// Load Polyfills
//
requirejs(['jquery', 'polyfiller', 'geoloc'], // TODO: not a good dependency structure
 function ( $      ){
	
	console.info('Loading polyfills...');
	$.webshims.setOptions({
		'waitReady': false,
		basePath: "/js/lib/webshim/src/shims/"
	});
	$.webshims.polyfill('geolocation');
	console.log('Polyfills loaded.');
	
});

//// Bootstrap Angular
//
requirejs(['angular', 'domReady!', 'talescape'],
 function ( angular ){
	
	console.info('Boostrapping Angular...');
	angular.bootstrap(document, ['TS']);
	console.log('Angular bootstrapped.');
	
});
