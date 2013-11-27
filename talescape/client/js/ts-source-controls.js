'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'gmaps', 'angular', 'TS'], function ($, gmaps, angular) {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	var NO_SOURCES = 0;
	var SOME_SOURCES = 1;
	var ALL_SOURCES = 2;

//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	angular.module('TS').directive('tsSourceControls', function () {
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		return {
			restrict   : 'E',
			templateUrl: 'partials/tsControls/ts-source-controls.html',
			replace    : true,
			require    : '^tsMap',
			scope      : {},

			link: function (scope, element, attrs, controller) {


				scope.icons = {};
				scope.icons[NO_SOURCES] = 'img/run-all.png';
				scope.icons[SOME_SOURCES] = 'img/pause-some.png';
				scope.icons[ALL_SOURCES] = 'img/pause-all.png';

				scope.nextScenarioIcon = function () {
					return ''; // TODO: create icon; or perhaps switch to a combobox and lose this button
				}

				scope.running = [];
				scope.count = [];


				/////////////////////////////////////////////
				////// Gathering Scenarios and Sources //////
				//////                                 //////


				var _sources = [];
				var _scenarios = [];
				var _currentScenario = 0;

				// TODO: The below is temporary, as this module doesn't pick up the registration of "" by ts-map
				_scenarios.push("");
				_sources[""] = [];

				scope.scenario = "";
				scope.running[""] = 0;
				scope.count[""] = 0;

				controller.onScenarioRegistered(function (scenario) {
					if (!_sources[scenario]) {
						_scenarios.push(scenario);
						_sources[scenario] = [];
						scope.count[scenario] = 0;
						scope.running[scenario] = 0;
					}
				});

				controller.onSourceRegistered(function (source, scenario) {
					_sources[scenario].push(source);
					scope.count[scenario]++;
					source.onRun(function () { scope.running[scenario]++; });
					source.onPause(function () { scope.running[scenario]--; });
				});


				////////////////////////////
				////// Display Button //////
				//////                //////


				controller.map().controls[gmaps.ControlPosition.TOP_LEFT].push(element[0]);


				/////////////////////////////
				////// Scope Functions //////
				//////                 //////


				scope.vagueCount = function () {
					if (scope.running[scope.scenario] == 0) { return NO_SOURCES; }
					else if (scope.running[scope.scenario] < scope.count[scope.scenario]) { return SOME_SOURCES; }
					else { return ALL_SOURCES; }
				}

				scope.runAll = function () {
					_sources[scope.scenario].map(function (source) {
						source.run();
					});
				};


				scope.pauseAll = function () {
					_sources[scope.scenario].map(function (source) {
						source.pause();
					});
				};

				scope.runOrPauseAll = function () {
					if (scope.running[scope.scenario] == 0) { scope.runAll(); }
					else { scope.pauseAll(); }
				};

				scope.nextScenario = function () {
					_currentScenario = (_currentScenario + 1) % _scenarios.length;
					scope.scenario = _scenarios[_currentScenario];
				};

			}
		};

//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	});
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
