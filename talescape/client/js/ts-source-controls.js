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
			templateUrl: 'partials/tsControls/tsSourceControls.html',
			replace    : true,
			require    : '^tsMap',
			scope: {},

			link: function (scope, element, attrs, controller) {

				scope.icons = {};
				scope.icons[NO_SOURCES] = 'img/run-all.png';
				scope.icons[SOME_SOURCES] = 'img/pause-some.png';
				scope.icons[ALL_SOURCES] = 'img/pause-all.png';

				scope.running = 0;
				scope.count = 0;


				///////////////////////////////
				////// Gathering Sources //////
				//////                   //////


				var sources = [];

				controller.onSourceRegistered(function (source) {
					sources.push(source);
					++scope.count;
					source.onRun(function () { ++scope.running; });
					source.onPause(function () { --scope.running; });
				});


				////////////////////////////
				////// Display Button //////
				//////                //////


				controller.map().controls[gmaps.ControlPosition.TOP_LEFT].push(element[0]);


				/////////////////////////////
				////// Scope Functions //////
				//////                 //////


				scope.vagueCount = function () {
					if (scope.running == 0) { return NO_SOURCES; }
					else if (scope.running < scope.count) { return SOME_SOURCES; }
					else { return ALL_SOURCES; }
				}

				scope.runAll = function () {
					sources.map(function (source) {
						source.run();
					});
				};


				scope.pauseAll = function () {
					sources.map(function (source) {
						source.pause();
					});
				};

				scope.runOrPauseAll = function () {
					if (scope.running == 0) { scope.runAll(); }
					else { scope.pauseAll(); }
				};


			}
		};

//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	});
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
