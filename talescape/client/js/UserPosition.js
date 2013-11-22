'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'geo', 'gmaps'], function ($, geo, gmaps) { //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	return function (_map) { ///////////////////////////////////////////////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


		var object = {};


		/////////////////////////////////
		////// The Position Marker //////
		//////                     //////


		function _icon(file) {
			return {
				url   : 'img/' + file,
				size  : new gmaps.Size(60, 60),
				anchor: new gmaps.Point(30, 30)
			};
		}

		var _locationMarker = new gmaps.Marker({
			map      : _map,
			title    : "You Are Here",
			zIndex   : 999, // always on the foreground
			clickable: true,
			draggable: false,
			icon     : _icon('marker.png')
		});

		var _locationMarkerAccuracyCircle = new gmaps.Circle({
			map          : _map,
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
		gmaps.event.addListener(_locationMarker, 'click', function (clickEvent) {
			clickEvent.stop();
			geo.toggleRealFakeGeo();

			//// TODO: Temporarily centering position based on real location only
			//
			_centerOnPos(!object.centeringOnPos());

			if (geo.usingRealGeo()) {
				_locationMarkerAccuracyCircle.setVisible(true);
				_locationMarker.setIcon(_icon('marker.png'));
				_locationMarker.setDraggable(false);
				gmaps.event.removeListener(_userPosListenerIds.drag);
				gmaps.event.removeListener(_userPosListenerIds.mousedown);
				gmaps.event.removeListener(_userPosListenerIds.mouseup);
			} else {
				_locationMarkerAccuracyCircle.setVisible(false);
				_locationMarker.setIcon(_icon('fakemarker.png'));
				_locationMarker.setDraggable(true);

				_userPosListenerIds.drag = gmaps.event.addListener(_locationMarker, 'drag', function (dragEvent) {
					geo.setFakePosition(dragEvent.latLng.lat(), dragEvent.latLng.lng());
				});

				_userPosListenerIds.mousedown = gmaps.event.addListener(_locationMarker, 'mousedown', function () {
					_locationMarker.setIcon(_icon('fakemarkerdragged.png'));
				});

				_userPosListenerIds.mouseup = gmaps.event.addListener(_locationMarker, 'mouseup', function () {
					_locationMarker.setIcon(_icon('fakemarker.png'));
				});
			}
		});


		////////////////////////////////////////
		////// Listening to User Position //////
		//////                            //////


		var _newPosCallbacks = $.Callbacks('unique');
		var _lastKnownPos;

		geo.watchPosition(function (userPos) {
			if (!_lastKnownPos || _lastKnownPos.coords != userPos.coords) {
//				console.log(
//						(geo.usingFakeGeo() ? "Fake " : "") +
//						"GeoLocation registered:\n" +
//						"- latitude:  " + userPos.coords.latitude + "\n" +
//						"- longitude: " + userPos.coords.longitude + "\n" +
//						"- accuracy:  " + userPos.coords.accuracy
//				);

				userPos.latLng = new gmaps.LatLng(
						userPos.coords.latitude,
						userPos.coords.longitude
				);

				_lastKnownPos = userPos;

				_positionMarker(userPos);

				_maybeCenterMap();

				_newPosCallbacks.fire(userPos);
			}
		}, function (error) {
			console.error(error.message);
		}, { enableHighAccuracy: true, maximumAge: 500});


		////////////////////////////////////////////
		////// Centering Map on User Position //////
		//////                                //////


		var _centeringOnPos = true;

		function _centerOnPos(val) {
			_centeringOnPos = val;
		}

		function _maybeCenterMap() {
			if (_centeringOnPos) {
				_map.setCenter(object.pos().latLng);
			}
		}


		////////////////////////////
		////// Public methods //////
		//////                //////


		object.onNewPos = function (handler) { _newPosCallbacks.add(handler); };

		object.pos = function () { return _lastKnownPos; };

		object.centeringOnPos = function () { return _centeringOnPos; };

		$.extend(this, object);


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	};//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
