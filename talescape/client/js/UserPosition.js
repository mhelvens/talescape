'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'gmaps', 'angular', 'TS'], function ($, gmaps, angular) { ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function _icon(file) {
		return {
			url   : 'img/' + file,
			size  : new gmaps.Size(60, 60),
			anchor: new gmaps.Point(30, 30)
		};
	}

//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	angular.module('TS').factory('UserPosition', ['geo', function (geo) { ///////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		return function (mapController) { //////////////////////////////////////////////////////////////////////////////
//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


			var result = {};


			/////////////////////////////////
			////// The Position Marker //////
			//////                     //////


			var _locationMarker = new gmaps.Marker({
				map      : mapController.map(),
				title    : "You Are Here",
				zIndex   : 999, // always on the foreground
				clickable: false,
				draggable: false,
				icon     : _icon('marker-geomode-real.png')
			});

			var _locationMarkerAccuracyCircle = new gmaps.Circle({
				map          : mapController.map(),
				strokeColor  : '#4190da',
				strokeOpacity: 0.8,
				strokeWeight : 1,
				fillColor    : '#4190da',
				fillOpacity  : 0.45,
				draggable    : false,
				editable     : false,
				clickable    : false
			});

			function _positionMarker(pos) {
				_locationMarker.setPosition(pos.latLng);
				_locationMarkerAccuracyCircle.setCenter(pos.latLng);
				_locationMarkerAccuracyCircle.setRadius(parseFloat(pos.coords.accuracy));
				//// parseFloat is used above for testing purposes only;
				//// The Chrome plugin to fake GPS location returns
				//// a string from userPos.coords.accuracy
			}


			/////////////////////////////////////////
			////// Interaction with the Marker //////
			//////                             //////


			var _userPosListenerIds = {};
			geo.onModeToggle(function (mode) {
				if (mode == geo.GEO_REAL) {
					_locationMarkerAccuracyCircle.setVisible(true);
					_locationMarker.setIcon(_icon('marker-geomode-real.png'));
					_locationMarker.setDraggable(false);
					gmaps.event.removeListener(_userPosListenerIds.drag);
					gmaps.event.removeListener(_userPosListenerIds.mousedown);
					gmaps.event.removeListener(_userPosListenerIds.mouseup);
				} else {
					_locationMarkerAccuracyCircle.setVisible(false);
					_locationMarker.setIcon(_icon('marker-geomode-fake.png'));
					_locationMarker.setDraggable(true);

					_userPosListenerIds.drag = gmaps.event.addListener(_locationMarker, 'drag', function (dragEvent) {
						geo.setFakePosition(dragEvent.latLng.lat(), dragEvent.latLng.lng());
					});

					_userPosListenerIds.mousedown = gmaps.event.addListener(_locationMarker, 'mousedown', function () {
						_locationMarker.setIcon(_icon('marker-geomode-fake-dragged.png'));
					});

					_userPosListenerIds.mouseup = gmaps.event.addListener(_locationMarker, 'mouseup', function () {
						_locationMarker.setIcon(_icon('marker-geomode-fake.png'));
					});
				}
			});


			////////////////////////////////////////
			////// Listening to User Position //////
			//////                            //////


			var _newPosCallbacks = $.Callbacks('unique');
			var _lastKnownPos = geo.lastKnownPosition();

			geo.watchPosition(function (userPos) {
				if (_lastKnownPos.coords != userPos.coords) {
//				console.log(
//						(geo.usingFakeGeo() ? "Fake " : "") +
//						"GeoLocation registered:\n" +
//						"- latitude:  " + userPos.coords.latitude + "\n" +
//						"- longitude: " + userPos.coords.longitude + "\n" +
//						"- accuracy:  " + userPos.coords.accuracy
//				);

					userPos.latLng = userPos.toLatLng();

					_lastKnownPos = userPos;

					_positionMarker(userPos);

					_newPosCallbacks.fire(userPos);
				}
			}, function (error) {
				console.error(error.message);
			}, { enableHighAccuracy: true, maximumAge: 500});


			////////////////////////////
			////// Public methods //////
			//////                //////


			result.onNewPos = function (handler) { return _newPosCallbacks.add(handler); };

			result.pos = function () { return _lastKnownPos; };

			$.extend(this, result);


//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		};//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	}]);////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
