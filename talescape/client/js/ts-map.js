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
					pre: function (scope, element, attrs, controller) {

						//// Create the map
						//
						controller.setMap(new gmaps.Map(element.children(".canvas")[0], {
							// fixed options
							mapTypeId             : gmaps.MapTypeId.SATELLITE,
							disableDefaultUI      : true,
							disableDoubleClickZoom: true,
							zoomControl           : true,
							zoomControlOptions    : { position: gmaps.ControlPosition.LEFT_TOP },
							styles                : [
								{featureType: "all", elementType: "labels", stylers: [
									{visibility: "off"}
								]}
							],
							// starting options
							zoom                  : parseInt(attrs['zoom']) || 18,
							center                : new gmaps.LatLng(
									parseFloat(attrs['lat']) || geo.DEFAULT_POSITION.coords.latitude,
									parseFloat(attrs['lng']) || geo.DEFAULT_POSITION.coords.latitude)
						}));

						controller.map().then(function (map) {

							//// Set fake position on double click
							//
							gmaps.event.addListener(map, 'dblclick', function (mouseEvent) {
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
									map.setCenter((userPos || geo.DEFAULT_POSITION).toLatLng());
								}
							});

							//// Adjust to new zoom-level
							//
							gmaps.event.addListener(map, 'zoom_changed', function () {
								if (controller.centering() == controller.CENTERING_USER) {
									map.setCenter((geo.lastKnownPosition() || geo.DEFAULT_POSITION).toLatLng());
								}
							});

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
