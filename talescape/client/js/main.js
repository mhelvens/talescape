'use strict';

//// RequireJS Configuration
//
require.config({
    paths: {
        'modernizr': 'lib/modernizr/modernizr',
        'polyfiller': 'lib/webshim/src/polyfiller',
        'domReady': 'lib/requirejs-domready/domReady',
        'async': 'lib/requirejs-plugins/src/async',
        'jquery': 'lib/jquery/jquery',
        'angular': 'lib/angular/angular',
        'infobox': 'lib/google-maps-utility-library-v3/infobox/src/infobox'
    },
    shim: {
        'polyfiller': ['jquery', 'modernizr'],
        'angular': { exports: 'angular' },
        'infobox': { deps: ['gmaps'], exports: 'InfoBox' }
    }
});


//// Load javascript patches before anything else
//
requirejs(['patches'], function () {


    //// The Angular Talescape Modules to Load
    //
    var TALESCAPE_ANGULAR_DIRECTIVES = [
        'ts-map',
        'ts-area',
        'ts-source-controls',
        'ts-user-pos-controls',
        'ts-source-editor'
    ];


    //// Load Polyfills
    //
    requirejs(['jquery', 'polyfiller'], function ($) {

        console.log("Loading polyfills...");

        $.webshims.setOptions({
            waitReady: false,
            basePath: "/js/lib/webshim/src/shims/"
        });

        $.webshims.setOptions('geolocation', {
            confirmText: "Talescape needs to know your GPS location. Is that OK?"
        });

        $.webshims.polyfill('geolocation');

        console.log("Polyfills loaded.");

    });


    //// Bootstrap Angular
    //
    requirejs(['angular', 'domReady!', 'ts-map'].concat(TALESCAPE_ANGULAR_DIRECTIVES), function (angular) {

        console.log('Bootstrapping Angular...');

        angular.bootstrap(document, ['TS']);

        console.log("App bootstrapped.");

    });


});
