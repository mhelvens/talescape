'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['gmaps', 'angular', 'TS', 'MapController', 'geo'], function (gmaps, angular) { /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	angular.module('TS').directive('tsMap', ['geo', function (geo) { ///////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		return { ///////////////////////////////////////////////////////////////////////////////////////////////////////
//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			controller : 'MapController',
			restrict   : 'E',
			templateUrl: 'partials/tsMap/ts-map.html',
			replace    : true,
			transclude : true,
			scope      : {subtitle: '='},

			compile: function () {
				return {
					pre : function (scope, element, attrs, controller) {

						//// Create the map
						//
						controller.setMap(new gmaps.Map(element.children(".canvas")[0], {
							// fixed options
							mapTypeId             : gmaps.MapTypeId.SATELLITE,
							disableDefaultUI      : true,
							disableDoubleClickZoom: true,
							styles                : [
								{featureType: "all", elementType: "labels", stylers: [
									{visibility: "off"}
								]}
							],
							// starting options
							zoom                  : parseInt(attrs['zoom']) || 20,
							center                : new gmaps.LatLng(
									parseFloat(attrs['lat']) || geo.DEFAULT_POSITION.coords.latitude,
									parseFloat(attrs['lng']) || geo.DEFAULT_POSITION.coords.latitude)
						}));

						//// Set fake position on double click
						//
						gmaps.event.addListener(controller.map(), 'dblclick', function (mouseEvent) {
							mouseEvent.stop();
							scope.$apply(function () {
								geo.setMode(geo.GEO_FAKE);
								geo.setFakePosition(mouseEvent.latLng.lat(), mouseEvent.latLng.lng());
							});
						});

						//// Adjust to new user position
						//
						geo.watchPosition(function (userPos) {
							if (controller.centering() == controller.CENTERING_USER) {
								controller.map().setCenter((userPos || geo.DEFAULT_POSITION).toLatLng());
							}
						});

						//// Adjust to new zoom-level
						//
						gmaps.event.addListener(controller.map(), 'zoom_changed', function () {
							if (controller.centering() == controller.CENTERING_USER) {
								controller.map().setCenter((geo.lastKnownPosition() || geo.DEFAULT_POSITION).toLatLng());
							}
						});
					}
				};
			}
//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		};//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	}]);////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
