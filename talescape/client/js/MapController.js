'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'gmaps', 'angular', 'TS', 'UserPosition', 'geo'], function ($, gmaps, angular) { /////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	angular.module('TS').controller('MapController', ['$scope', '$q', 'UserPosition', 'geo', function ($scope, $q, UserPosition, geo) {
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


		var result = {};


		////////////////////////////
		////// Manage the Map //////
		//////                //////


		//// Getting the map
		//
		var _map = $q.defer();
		result.map = function () {
			return _map.promise;
		};


		//// Setting the map
		//
		result.setMap = function (map) {
			_map.notify(map); // created but not ready
			gmaps.event.addListenerOnce(map, 'idle', function () {
				_map.resolve(map); // ready
			});
			delete result.setMap; // only set it once
		};


		/////////////////////////////////////////////
		////// Manage the User Position Marker //////
		//////                                 //////


		//// Storing the user position marker
		//
		var _userPos;


		//// Initialize the user position marker when the map is ready
		//
		result.map().then(function (map) {
			_userPos = new UserPosition(map);
		});

		/////////////////////////////////////////
		////// Manage the Centering Policy //////
		//////                             //////


		//// The possible centering policies
		//
		result.CENTERING_NOT = 'CENTERING_NOT';
		result.CENTERING_USER = 'CENTERING_USER';


		//// Storing the centering policy
		//
		var _centering;


		//// Getting the centering policy
		//
		result.centering = function () {
			return _centering;
		};


		//// Subscribing to changes of the centering policy
		//
		var _onCenteringChangedCallbacks = $.Callbacks('unique');
		//
		result.onCenteringChanged = function (handler) {
			_onCenteringChangedCallbacks.add(handler);
		};


		//// We immediately subscribe ourselves, because
		//// we want to adjust the map to the centering policy
		//
		result.map().then(function (map) {
			result.onCenteringChanged(function (centering) {
				if (centering == result.CENTERING_USER) {
					map.setCenter((geo.lastKnownPosition() || geo.DEFAULT_POSITION).toLatLng());
					map.setOptions({ draggable: false });
				} else {
					map.setOptions({ draggable: true });
				}
			});
		});


		//// Methods to set the centering policy
		//
		result.setCentering = function (val) {
			_centering = val;
			_onCenteringChangedCallbacks.fire(_centering);
		};
		//
		result.toggleCentering = function () {
			if (result.centering() == result.CENTERING_NOT) {
				result.setCentering(result.CENTERING_USER);
			} else {
				result.setCentering(result.CENTERING_NOT);
			}
		};


		//// Initialize: do not, by default, center in on the user
		//
		result.setCentering(result.CENTERING_NOT);


		//// But we want to start centered, regardless of the centering policy
		//
		// TODO: Unless we will be centering in on a scenario! Don't center again after that happens!
		//
		$q.all({map: result.map(), pos: geo.currentPosition()}).then(function (p) {
			p.map.setCenter(p.pos.toLatLng());
		});
//		result.map().then(function(map) {
//			geo.currentPosition().then(function(pos) {
//				map.setCenter(pos.toLatLng());
//			});
//		});


		///////////////////////////////////
		////// Registering Scenarios //////
		//////                       //////

		var _scenarios = []; // maps scenarios to an array of sources
		_scenarios[null] = []; // for sources without scenario

		var _scenarioRegisteredCallback = $.Callbacks('unique');

		result.registerScenario = function (scenario) {
			if (scenario !== undefined && _scenarios[scenario] === undefined) {
				_scenarios[scenario] = [];
				_scenarioRegisteredCallback.fire(scenario);
			}
		};

		result.onScenarioRegistered = function (handler) {
			for (var sc in _scenarios) {
				if (_scenarios.hasOwnProperty(sc) && sc) {
					handler(sc);
				}
			}
			_scenarioRegisteredCallback.add(handler);
		};


		/////////////////////////////////
		////// Registering Sources //////
		//////                     //////


		var _sourceRegisteredCallback = $.Callbacks('unique');

		result.registerSource = function (source, scenario) {
			_scenarios[scenario || null].push(source);
			_sourceRegisteredCallback.fire(source, scenario || null);
		};

		result.onSourceRegistered = function (handler) {
			for (var sc in _scenarios) {
				if (_scenarios.hasOwnProperty(sc)) {
					_scenarios[sc].map(function (source) {
						handler(source);
					});
				}
			}
			_sourceRegisteredCallback.add(handler);
		};


		////////////////////////////


		$.extend(this, result);


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	}]);////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
