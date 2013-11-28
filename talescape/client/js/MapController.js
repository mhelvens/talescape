'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'gmaps', 'angular', 'TS', 'UserPosition', 'geo'], function ($, gmaps, angular) { /////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	angular.module('TS').controller('MapController', ['$scope', 'UserPosition', 'geo', function ($scope, UserPosition, geo) {
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


		var result = {};


		////////////////////////////
		////// Manage the Map //////
		//////                //////


		//// Storing the map
		//
		var _map;


		//// Getting the map
		//
		result.map = function () {
			return _map;
		};


		//// Setting the map
		//
		var _mapSetCallbacks = $.Callbacks('unique');
		result.setMap = function (map) {
			_map = map;
			_mapSetCallbacks.fire();
		};


		//// Scheduling stuff for when the map is set and ready
		//
		result.whenMapIsReady = function (handler) {
			function listenToMapIdle() {
				gmaps.event.addListenerOnce(_map, 'idle', function() {
					$scope.$apply(function() { handler(_map); });
				});
			}

			if (_map) {
				listenToMapIdle();
			} else {
				_mapSetCallbacks.add(listenToMapIdle);
			}
		};


		/////////////////////////////////////////////
		////// Manage the User Position Marker //////
		//////                                 //////


		//// Storing the user position marker
		//
		var _userPos;


		//// Initialize the user position marker when the map is ready
		//
		result.whenMapIsReady(function(map) {
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
		_mapSetCallbacks.add(function() {
			result.onCenteringChanged(function (centering) {
				if (centering == result.CENTERING_USER) {
					_map.setCenter((geo.lastKnownPosition() || geo.DEFAULT_POSITION).toLatLng());
					_map.setOptions({ draggable: false });
				} else {
					_map.setOptions({ draggable: true });
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
		geo.getCurrentPosition(function (pos) {
			_map.setCenter(pos.toLatLng());
		});




		///////////////////////////////////
		////// Registering Scenarios //////
		//////                       //////


		result.ROOT_SCENARIO = "";

		var _scenarios = []; // maps scenarios to an array of sources

		var _scenarioRegisteredCallback = $.Callbacks('unique');

		result.registerScenario = function (scenario) {
			if (scenario !== undefined && _scenarios[scenario] === undefined) {
				_scenarios[scenario] = [];
				_scenarioRegisteredCallback.fire(scenario);
			}
		};

		result.onScenarioRegistered = function (handler) {
			for (var sc in _scenarios) {
				//noinspection JSUnfilteredForInLoop
				handler(sc);
			}
			_scenarioRegisteredCallback.add(handler);
		};

		//// register the root scenario
		//
		result.registerScenario(result.ROOT_SCENARIO);


		/////////////////////////////////
		////// Registering Sources //////
		//////                     //////


		var _sourceRegisteredCallback = $.Callbacks('unique');

		result.registerSource = function (source, scenario) {
			//noinspection AssignmentToFunctionParameterJS
			scenario = (scenario === undefined ? ROOT_SCENARIO : scenario);
			_scenarios[scenario].push(source);
			_sourceRegisteredCallback.fire(source, scenario);
		};

		result.onSourceRegistered = function (handler) {
			for (var sc in _scenarios) {
				//noinspection JSUnfilteredForInLoop
				_scenarios[sc].map(function (source) {
					handler(source);
				});
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
