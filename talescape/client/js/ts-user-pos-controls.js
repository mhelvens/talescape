'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'gmaps', 'angular', 'geo', 'TS', 'ts-map'], function ($, gmaps, angular) {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	angular.module('TS').directive('tsUserPosControls', ['geo', function (geo) {
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		return {
			restrict   : 'E',
			templateUrl: 'partials/tsControls/tsUserPosControls.html',
			replace    : true,
			require    : '^tsMap',
			scope      : {},

			link: function (scope, element, attrs, controller) {


				//////////////////////
				////// Geo Mode //////
				//////          //////


				var GEOMODE = [];
				GEOMODE[geo.GEO_REAL] = [];
				GEOMODE[geo.GEO_FAKE] = [];

				GEOMODE[geo.GEO_REAL][geo.GEO_KNOWN] = {
					icon : 'img/geomode-real.png',
					title: 'Currently using real GPS coordinates.'
				};

				GEOMODE[geo.GEO_REAL][geo.GEO_UNKNOWN] = {
					icon : 'img/geomode-real-unknown.png',
					title: 'Currently trying to use real GPS coordinates, but your position is unknown.'
				};

				GEOMODE[geo.GEO_FAKE][geo.GEO_KNOWN] = {
					icon : 'img/geomode-fake.png',
					title: 'Currently using manual GPS coordinates.'
				};

				GEOMODE[geo.GEO_FAKE][geo.GEO_UNKNOWN] = {
					icon : 'img/geomode-fake-unknown.png',
					title: 'Currently using manual GPS coordinates (your real position is unknown).'
				};


				scope.toggleGeoMode = geo.toggleMode;
				scope.geoModeIcon = function () { return GEOMODE[geo.mode()][geo.known()].icon; };
				scope.geoModeTitle = function () { return GEOMODE[geo.mode()][geo.known()].title; };


				///////////////////////
				////// Centering //////
				//////           //////


				var CENTERING_ICONS = [];
				CENTERING_ICONS[controller.CENTERING_NOT] = 'img/centering-not.png';
				CENTERING_ICONS[controller.CENTERING_USER] = 'img/centering-user.png';

				var CENTERING_TITLES = [];
				CENTERING_TITLES[controller.CENTERING_NOT] = 'Currently not auto-centering the map.';
				CENTERING_TITLES[controller.CENTERING_USER] = 'Currently auto-centering the map on your position.';


				scope.toggleCentering = controller.toggleCentering;
				scope.centeringIcon = function () { return CENTERING_ICONS[controller.centering()]; };
				scope.centeringTitle = function () { return CENTERING_TITLES[controller.centering()]; };


				/////////////////////////////
				////// Display Buttons //////
				//////                 //////


				controller.map().controls[gmaps.ControlPosition.TOP_LEFT].push(element[0]);


			}
		};

//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	}]);
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
