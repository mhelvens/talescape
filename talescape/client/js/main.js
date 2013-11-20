'use strict';

//// RequireJS Configuration
//
require.config({
	paths: {
		'modernizr' : 'lib/modernizr/modernizr',
		'polyfiller': 'lib/webshim/src/polyfiller',
		'domReady'  : 'lib/requirejs-domready/domReady',
		'async'     : 'lib/requirejs-plugins/src/async',
		'jquery'    : 'lib/jquery/jquery',
		'angular'   : 'lib/angular/angular'
	},
	shim : {
		'polyfiller': ['jquery', 'modernizr'],
		'angular'   : { exports: 'angular' }
	}
});

//// Load javascript patches before anything else
//
requirejs(['patches'], function () {

	//// Load Polyfills
	//
	requirejs(['jquery', 'polyfiller'], function ($) {

		console.info('Loading polyfills...');

		$.webshims.setOptions({
			waitReady: false,
			basePath : "/js/lib/webshim/src/shims/"
		});

		$.webshims.setOptions('geolocation', {
			confirmText: 'Talescape needs to know your GPS location. Is that OK?'
		});
		$.webshims.polyfill('geolocation');

		console.log('Polyfills loaded.');

	});

	//// Bootstrap Angular
	//
	requirejs(['angular', 'domReady!', 'TS'], function (angular) {

		console.info('Bootstrapping Angular...');

		angular.bootstrap(document, ['TS']);

		console.log('Angular bootstrapped.');

	});

});


//// Test
//
/*
requirejs(['jquery', 'domReady!'],
 function ( $      ){
	console.info('Testing...');


	$('div.test.A').click(function() {
		console.debug("First play");
		$('audio.test')[0].play();
	});

	$('div.test.B').click(function() {
	});
	setTimeout(function() {
		console.debug("Real play 1");
		$('audio.test')[0].src = "audio/cairnomount.mp3";
		$('audio.test')[0].play();
	}, 6000);
	setTimeout(function() {
		console.debug("Real play 2");
		$('audio.test')[0].src = "audio/saewill.mp3";
		$('audio.test')[0].play();
	}, 12000);

	$('audio.test').one('play', function() {
		console.debug("First pause");
		$('audio.test')[0].pause();
	});



	console.log('Done testing.');

});
*/


