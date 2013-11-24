'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'gmaps', 'angular', 'SourceEditor', 'TS', 'UserPosition'], function ($, gmaps, angular, SourceEditor) {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	////////////////////////////////////////////////////////////
	// MapController ///////////////////////////////////////////
	////////////////////////////////////////////////////////////


	angular.module('TS').controller('MapController', ['$scope', '$element', '$attrs', 'geo', 'UserPosition', function ($scope, $element, $attrs, geo, UserPosition) {


		var result = {};


		/////////////////////////////
		////// Create the Map //////
		//////                //////


		var _map = new gmaps.Map($element.children(".canvas")[0], {
			// fixed options
			mapTypeId       : gmaps.MapTypeId.SATELLITE,  // default: satellite view
			disableDefaultUI: true,                       // default: no controls
			styles          : [
				{featureType: "all", elementType: "labels", stylers: [
					{visibility: "off"}
				]}
			],
			zoom            : parseInt($attrs['zoom']) || 20, // start zoom level
			center          : new gmaps.LatLng(
					parseFloat($attrs['lat']) || 52.3564841,
					parseFloat($attrs['lng']) || 4.9520856)   // start location (default: CWI)
		});


		result.map = function () {
			return _map;
		};


		/////////////////////////////////////////////////
		////// Manage the User Position on the Map //////
		//////                                     //////


		var _userPos = new UserPosition(result);


		result.onNewUserPos = function (handler) {
			_userPos.onNewPos(handler);
		};

		result.userPos = function () {
			return _userPos.pos();
		};


		/////////////////////////////
		////// Manage Centring //////
		//////                 //////

		result.CENTERING_NOT = 'value: centering-not';
		result.CENTERING_USER = 'value: centering-user';

		var _centering = result.CENTERING_USER;
		var _onCenteringChangedCallbacks = $.Callbacks('unique');


		result.centering = function () {
			return _centering;
		};

		result.toggleCentering = function () {
			if (_centering == result.CENTERING_NOT) {
				_centering = result.CENTERING_USER;
			} else {
				_centering = result.CENTERING_NOT;
			}
			_onCenteringChangedCallbacks.fire(_centering);
		};

		result.onCenteringChanged = function (handler) {
			_onCenteringChangedCallbacks.add(handler);
		};

		result.onCenteringChanged(function (centering) {
			if (centering == result.CENTERING_USER) {
				_map.setCenter((_userPos.pos() || geo.DEFAULT_POSITION).toLatLng());
				_map.setOptions({ draggable: false });
			} else {
				_map.setOptions({ draggable: true });
			}
		});

		_userPos.onNewPos(function (pos) {
			if (_centering == result.CENTERING_USER) {
				_map.setCenter((pos || geo.DEFAULT_POSITION).toLatLng());
			}
		});

		gmaps.event.addListener(_map, 'zoom_changed', function () {
			if (_centering == result.CENTERING_USER) {
				_map.setCenter((_userPos.pos() || geo.DEFAULT_POSITION).toLatLng());
			}
		});

		_onCenteringChangedCallbacks.fire(_centering);


		////////////////////////////////////////
		////// Adding and Editing Sources //////
		//////                            //////


		new SourceEditor(_map);


		/////////////////////////////////
		////// Registering Sources //////
		//////                     //////


		var _sourceRegisteredCallback = $.Callbacks('unique');


		result.registerSource = function (source) {
			_sourceRegisteredCallback.fire(source);
		};

		result.onSourceRegistered = function (handler) {
			_sourceRegisteredCallback.add(handler);
		};


		////////////////////////////


		$.extend(this, result);


	}]);


	////////////////////////////////////////////////////////////
	// 'ts-map' Directive //////////////////////////////////////
	////////////////////////////////////////////////////////////


	angular.module('TS').directive('tsMap', function () {
		return {
			controller : 'MapController',
			restrict   : 'E',
			templateUrl: 'partials/tsMap/tsMap.html',
			replace    : true,
			transclude : true,
			scope      : {}
		};
	});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
