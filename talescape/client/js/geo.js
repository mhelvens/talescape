'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'gmaps', 'angular', 'TS'], function ($, gmaps, angular, TS) { ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	function _latLngToFakePosition(lat, lng) {
		return {
			timestamp: Date.now(),
			coords   : {
				latitude : lat,
				longitude: lng,
				accuracy : 0
			},
			toLatLng : function () {
				return new gmaps.LatLng(lat, lng);
			}
		};
	}


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	angular.module('TS').factory('geo', ['$rootScope', function ($rootScope) { /////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


		var result = {};


		///////////////////////////////


		result.GEO_REAL = 'value: geo-real';
		result.GEO_FAKE = 'value: geo-fake';

		result.GEO_UNKNOWN = 'value: geo-unknown';
		result.GEO_KNOWN = 'value: geo-known';

		var _geoMode = result.GEO_REAL;
		var _geoKnown = result.GEO_UNKNOWN;

		result.DEFAULT_POSITION = _latLngToFakePosition(52.3567841, 4.9520856); // CWI, Amsterdam

		var _fakePosition = result.DEFAULT_POSITION;
		var _lastRealPosition = result.DEFAULT_POSITION;

		var _watchers = [];

		function _notifyWatchers() {
			var i;
			if (_geoMode == result.GEO_REAL) {
				if (_lastRealPosition) {
					for (i = 0; i < _geoWatchIdCount; ++i) {
						if (_watchers[i]) {
							_watchers[i].successCallback(_lastRealPosition);
						}
					}
				}
			} else {
				for (i = 0; i < _geoWatchIdCount; ++i) {
					if (_watchers[i]) {
						_watchers[i].successCallback(_fakePosition);
					}
				}
			}
		}

		result.getCurrentPosition = function (successCallback, errorCallback, options) {
			if (_geoMode == result.GEO_REAL) {
				$.webshims.ready('geolocation', function () {
					navigator.geolocation.getCurrentPosition(function (position) {
						position.toLatLng = function () {
							return new gmaps.LatLng(
									position.coords.latitude,
									position.coords.longitude);
						};
						$rootScope.$apply(function () {
							_geoKnown = result.GEO_KNOWN;
							_lastRealPosition = position;
						});
						successCallback(position);
					}, function (err) {
						$rootScope.$apply(function () {
							_geoKnown = result.GEO_UNKNOWN;
						});
						errorCallback(err);
					}, options);
				});
			} else if (_geoMode == result.GEO_FAKE) {
				successCallback(_fakePosition);
			}
		};

		var _geoWatchIdCount = 0;
		var _geoWatchIdToWatchId = [];

		result.watchPosition = function (successCallback, errorCallback, options) {
			var id = _geoWatchIdCount++;

			$.webshims.ready('geolocation', function () {
				_geoWatchIdToWatchId[id] = navigator.geolocation.watchPosition(
						function (position) {
							position.toLatLng = function () {
								return new gmaps.LatLng(
										position.coords.latitude,
										position.coords.longitude);
							};
							$rootScope.$apply(function () {
								_geoKnown = result.GEO_KNOWN;
								_lastRealPosition = position;
							});
							if (_geoMode == result.GEO_REAL) { successCallback(position); }
						},
						function (positionError) {
							$rootScope.$apply(function () {
								_geoKnown = result.GEO_UNKNOWN;
							});
							if (_geoMode == result.GEO_REAL) { errorCallback(positionError); }
						},
						options);
			});

			_watchers[id] = {
				successCallback: successCallback,
				errorCallback  : errorCallback
			};

			if (_geoMode == result.GEO_FAKE) {
				successCallback(_fakePosition);
			}

			return id;
		};

		result.clearWatch = function (geoWatchId) {
			$.webshims.ready('geolocation', function () {
				navigator.geolocation.clearWatch(_geoWatchIdToWatchId[geoWatchId]);
			});
			_watchers[geoWatchId] = null;
		};


		result.setFakePosition = function (lat, lng) {
			_fakePosition = _latLngToFakePosition(lat, lng);
			_notifyWatchers();
		};

		result.lastKnownPosition = function () {
			if (_geoMode == result.GEO_REAL) { return _lastRealPosition; }
			else if (_fakePosition) { return _fakePosition; }
			else { return result.DEFAULT_POSITION; }
		};


		///////////////////////////////
		////// Managing Geo Mode //////
		//////                   //////


		var _onModeToggleCallbacks = $.Callbacks('unique');

		function _useRealGeo() {
			_geoMode = result.GEO_REAL;
			if (_lastRealPosition) _notifyWatchers();
			_onModeToggleCallbacks.fire(result.GEO_REAL);
		}

		function _useFakeGeo(lat, lng) {
			if (lat) { _fakePosition = _latLngToFakePosition(lat, lng); }
			else if (_lastRealPosition) { _fakePosition = _lastRealPosition; }
			else { _fakePosition = result.DEFAULT_POSITION; }

			_geoMode = result.GEO_FAKE;
			_notifyWatchers();
			_onModeToggleCallbacks.fire(result.GEO_FAKE);
		}


		result.mode = function () {
			return _geoMode;
		};

		result.known = function () {
			return _geoKnown;
		};

		result.setMode = function (mode) {
			if (mode == result.GEO_REAL) { _useRealGeo(); }
			else { _useFakeGeo(); }
		};

		result.toggleMode = function () {
			if (_geoMode == result.GEO_FAKE) { _useRealGeo(); }
			else { _useFakeGeo(); }
			_onModeToggleCallbacks.fire(result.mode());
		};

		result.onModeToggle = function (handler) {
			_onModeToggleCallbacks.add(handler);
		};


		///////////////////////////////


		return result;


	}]);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
