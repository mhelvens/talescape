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

	var _fakeWatchers = [];

	function _notifyFakeWatchers() {
		var i;
		if (_fakePosition) {
			for (i = 0; i < _geoWatchIdCount; ++i) {
				if (_fakeWatchers[i]) {
					_fakeWatchers[i].successCallback(_fakePosition);
				}
			}
		} else {
			for (i = 0; i < _geoWatchIdCount; ++i) {
				if (_fakeWatchers[i]) {
					_fakeWatchers[i].errorCallback(FAKE_POSITION_ERROR);
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
				navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
			});
		} else if (_geoType == FAKE_GEO) {

			if (_fakePosition) { successCallback(_fakePosition); }
			else { errorCallback(FAKE_POSITION_ERROR); }

		}
	};

	var _geoWatchIdCount = 0;
	var _geoWatchIdToWatchId = [];

	result.watchPosition = function (successCallback, errorCallback, options) {
		var id = _geoWatchIdCount++;

		$.webshims.ready('geolocation', function () {
			_geoWatchIdToWatchId[id] = navigator.geolocation.watchPosition(
					function (position) { if (_geoType == REAL_GEO) { successCallback(position); } },
					function (positionError) { if (_geoType == REAL_GEO) { errorCallback(positionError); } },
					options);
		});

		_fakeWatchers[id] = {
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
		_fakeWatchers[geoWatchId] = null;
	};

	result.useRealGeo = function () {
		_geoType = REAL_GEO;
	};

	result.useFakeGeo = function (lat, lng) {
		_geoType = FAKE_GEO;
		if (lat) _fakePosition = _latLngToFakePosition(lat, lng);
		if (_fakePosition) { _notifyFakeWatchers(); }
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
		_notifyFakeWatchers();
	};


	return result;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
