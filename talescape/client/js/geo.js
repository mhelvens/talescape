'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery'], function ($) { //////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var REAL_GEO = 0;
	var FAKE_GEO = 1;

	var _geoType = REAL_GEO;

	var FAKE_POSITION_ERROR = {
		PERMISSION_DENIED   : 1,
		POSITION_UNAVAILABLE: 2,
		TIMEOUT             : 3,
		code                : 2,
		message             : "A fake geolocation provider is in use, but no fake position has been supplied."
	};

	var _fakePosition = null;

	var _watchers = [];

	function _notifyWatchers() {
		var i;
		if (_geoType == REAL_GEO) {
			if (_lastRealPosition) {
				for (i = 0; i < _geoWatchIdCount; ++i) {
					if (_watchers[i]) {
						_watchers[i].successCallback(_lastRealPosition);
					}
				}
			}
		} else {
			if (_fakePosition) {
				for (i = 0; i < _geoWatchIdCount; ++i) {
					if (_watchers[i]) {
						_watchers[i].successCallback(_fakePosition);
					}
				}
			} else {
				for (i = 0; i < _geoWatchIdCount; ++i) {
					if (_watchers[i]) {
						_watchers[i].errorCallback(FAKE_POSITION_ERROR);
					}
				}
			}
		}
	}

	function _latLngToFakePosition(lat, lng) {
		return {
			coords   : {
				latitude : lat,
				longitude: lng,
				accuracy : 0
			},
			timestamp: Date.now()
		};
	}


	var result = {};

	result.getCurrentPosition = function (successCallback, errorCallback, options) {
		if (_geoType == REAL_GEO) {
			$.webshims.ready('geolocation', function () {
				navigator.geolocation.getCurrentPosition(function (position) {
					_lastRealPosition = position;
					successCallback(position);
				}, errorCallback, options);
			});
		} else if (_geoType == FAKE_GEO) {

			if (_fakePosition) { successCallback(_fakePosition); }
			else { errorCallback(FAKE_POSITION_ERROR); }

		}
	};

	var _geoWatchIdCount = 0;
	var _geoWatchIdToWatchId = [];

	var _lastRealPosition;

	result.watchPosition = function (successCallback, errorCallback, options) {
		var id = _geoWatchIdCount++;

		$.webshims.ready('geolocation', function () {
			_geoWatchIdToWatchId[id] = navigator.geolocation.watchPosition(
					function (position) {
						_lastRealPosition = position;
						if (_geoType == REAL_GEO) { successCallback(position); }
					},
					function (positionError) { if (_geoType == REAL_GEO) { errorCallback(positionError); } },
					options);
		});

		_watchers[id] = {
			successCallback: successCallback,
			errorCallback  : errorCallback
		};

		if (_geoType == FAKE_GEO) {
			if (_fakePosition) { successCallback(_fakePosition); }
			else { errorCallback(FAKE_POSITION_ERROR); }
		}

		return id;
	};

	result.clearWatch = function (geoWatchId) {
		$.webshims.ready('geolocation', function () {
			navigator.geolocation.clearWatch(_geoWatchIdToWatchId[geoWatchId]);
		});
		_watchers[geoWatchId] = null;
	};

	result.useRealGeo = function () {
		_geoType = REAL_GEO;
		if (_lastRealPosition) _notifyWatchers();
	};

	result.useFakeGeo = function (lat, lng) {
		_geoType = FAKE_GEO;
		if (lat) { _fakePosition = _latLngToFakePosition(lat, lng); }
		else if (_lastRealPosition) { _fakePosition = _lastRealPosition; }
		if (_fakePosition) { _notifyWatchers(); }
	};

	result.toggleRealFakeGeo = function () {
		if (result.usingRealGeo()) { result.useFakeGeo(); }
		else { result.useRealGeo(); }
	};

	result.usingRealGeo = function () {
		return _geoType == REAL_GEO;
	};

	result.usingFakeGeo = function () {
		return _geoType == FAKE_GEO;
	};

	result.setFakePosition = function (lat, lng) {
		//noinspection ReuseOfLocalVariableJS
		_fakePosition = _latLngToFakePosition(lat, lng);
		_notifyWatchers();
	};

	result.lastKnownPosition = function () {
		if (_geoType == REAL_GEO) { return _lastRealPosition; }
		else { return _fakePosition; }
	};


	return result;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
