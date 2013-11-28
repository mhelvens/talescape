'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'gmaps', 'angular', 'TS', 'ts-map'], function ($, gmaps, angular) { //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function _icon(file) {
		return {
			url   : 'img/' + file,
			size  : new gmaps.Size(60, 60),
			anchor: new gmaps.Point(30, 30)
		};
	}

//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	angular.module('TS').factory('UserPosition', ['geo', function (geo) { //////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		return function (map) { ////////////////////////////////////////////////////////////////////////////////////////
//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


			/////////////////////////////////
			////// The Position Marker //////
			//////                     //////


			var _positionMarker = new gmaps.Marker({
				map: map,
				title    : "You Are Here",
				zIndex   : 999, // always on the foreground
				clickable: false,
				draggable: false,
				icon     : _icon('marker-geomode-real.png')
			});


			var _accuracyCircle = new gmaps.Circle({
				map: map,
				strokeColor  : '#4190da',
				strokeOpacity: 0.8,
				strokeWeight : 1,
				fillColor    : '#4190da',
				fillOpacity  : 0.45,
				draggable    : false,
				editable     : false,
				clickable    : false
			});


			function _placePositionMarker(pos) {
				_positionMarker.setPosition(pos.toLatLng());
				_accuracyCircle.setCenter(pos.toLatLng());
				_accuracyCircle.setRadius(parseFloat(pos.coords.accuracy));
				//// parseFloat is used above for testing purposes only;
				//// The Chrome plugin to fake GPS location returns
				//// a string from userPos.coords.accuracy
			}


			//////////////////////////////////////////////////////////
			////// Interaction with the Marker in Fake Geo-mode //////
			//////                                              //////


			geo.onModeToggle(function (mode) {
				if (mode == geo.GEO_REAL) {
					_accuracyCircle.setVisible(true);
					_positionMarker.setIcon(_icon('marker-geomode-real.png'));
					_positionMarker.setDraggable(false);
					gmaps.event.clearInstanceListeners(_positionMarker);
				} else {
					_accuracyCircle.setVisible(false);
					_positionMarker.setIcon(_icon('marker-geomode-fake.png'));
					_positionMarker.setDraggable(true);

					gmaps.event.addListener(_positionMarker, 'drag', function (dragEvent) {
						geo.setFakePosition(dragEvent.latLng.lat(), dragEvent.latLng.lng());
					});

					gmaps.event.addListener(_positionMarker, 'mousedown', function () {
						_positionMarker.setIcon(_icon('marker-geomode-fake-dragged.png'));
					});

					gmaps.event.addListener(_positionMarker, 'mouseup', function () {
						_positionMarker.setIcon(_icon('marker-geomode-fake.png'));
					});
				}
			});


			////////////////////////////////////////
			////// Listening to User Position //////
			//////                            //////


			geo.watchPosition(function (userPos) {
				_placePositionMarker(userPos);
			}, function (error) {
				console.error(error.message);
			}, { enableHighAccuracy: true, maximumAge: 500});


//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		};//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	}]);////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
