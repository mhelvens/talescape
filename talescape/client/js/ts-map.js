'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'gmaps', 'angular', 'TS', 'UserPosition', 'ts-source-editor', 'geo'], function ($, gmaps, angular) { ////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	//// The root scenario is the empty string ""
	//// (for sources directly under ts-map)
	//
	var ROOT_SCENARIO = "";


	////////////////////////////////////////////////////////////
	// MapController ///////////////////////////////////////////
	////////////////////////////////////////////////////////////


	angular.module('TS').controller('MapController', ['UserPosition', 'geo', function (UserPosition, geo) {


		var result = {};


		//////////////////////////////////////////////////////
		////// Create the Map and Set the User Position //////
		//////                                          //////


		var _map;
		var _userPos;

		result.setMap = function (map) {
			_map = map;
			_userPos = new UserPosition(map);
		};

		result.map = function () {
			return _map;
		};

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

		//// The initial setting is not to center automaticaly,
		//
		var _centering = result.CENTERING_NOT;


		//// But we do want to start centered
		//
		geo.getCurrentPosition(function (pos) {
			_map.setCenter(pos.toLatLng());
		});

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

		_onCenteringChangedCallbacks.fire(_centering);


		///////////////////////////////////
		////// Registering Scenarios //////
		//////                       //////

		var _scenarios = []; // maps scenarios to an array of sources

		var _scenarioRegisteredCallback = $.Callbacks('unique');

		result.registerScenario = function (scenario) {
			if (scenario !== undefined) {
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
		result.registerScenario(ROOT_SCENARIO);


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


	}]);


	////////////////////////////////////////////////////////////
	// 'ts-map' Directive //////////////////////////////////////
	////////////////////////////////////////////////////////////


	angular.module('TS').directive('tsMap', ['geo', function (geo) {
		return {
			controller : 'MapController',
			restrict   : 'E',
			templateUrl: 'partials/tsMap/ts-map.html',
			replace    : true,
			transclude : true,
			scope: {},

			compile: function () {
				return {
					pre : function (scope, element, attrs, controller) {
						//// Create the map
						//
						controller.setMap(new gmaps.Map(element.children(".canvas")[0], {
							// fixed options
							mapTypeId             : gmaps.MapTypeId.SATELLITE,
							disableDefaultUI      : true,
							disableDoubleClickZoom: true,
							styles                : [
								{featureType: "all", elementType: "labels", stylers: [
									{visibility: "off"}
								]}
							],
							// starting options
							zoom                  : parseInt(attrs['zoom']) || 20,
							center                : new gmaps.LatLng(
									parseFloat(attrs['lat']) || geo.DEFAULT_POSITION.coords.latitude,
									parseFloat(attrs['lng']) || geo.DEFAULT_POSITION.coords.latitude)
						}));

						//// Set fake position on double click
						//
						gmaps.event.addListener(controller.map(), 'dblclick', function (mouseEvent) {
							mouseEvent.stop();
							scope.$apply(function () {
								geo.setMode(geo.GEO_FAKE);
								geo.setFakePosition(mouseEvent.latLng.lat(), mouseEvent.latLng.lng());
							});
						});

						//// Adjust to new centering settings
						//
						controller.onCenteringChanged(function (centering) {
							if (centering == controller.CENTERING_USER) {
								controller.map().setCenter((geo.lastKnownPosition() || geo.DEFAULT_POSITION).toLatLng());
								controller.map().setOptions({ draggable: false });
							} else {
								controller.map().setOptions({ draggable: true });
							}
						});

						//// Adjust to new user position
						//
						geo.watchPosition(function (userPos) {
							if (controller.centering() == controller.CENTERING_USER) {
								controller.map().setCenter((userPos || geo.DEFAULT_POSITION).toLatLng());
							}
						});

						//// Adjust to new zoom-level
						//
						gmaps.event.addListener(controller.map(), 'zoom_changed', function () {
							if (controller.centering() == controller.CENTERING_USER) {
								scope.$apply(function () {
									controller.map().setCenter((geo.lastKnownPosition() || geo.DEFAULT_POSITION).toLatLng());
								});
							}
						});
					},
					post: function (scope, element, attrs, controller) {

					}
				};
			}
		};
	}]);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
