'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'gmaps', 'angular', 'infobox', 'TS', 'ts-map', 'geo'], function ($, gmaps, angular) { //////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	var NO_SOURCES = 0;
	var SOME_SOURCES = 1;
	var ALL_SOURCES = 2;

	var ICONS = [];
	ICONS[NO_SOURCES] = 'img/run-all.png';
	ICONS[SOME_SOURCES] = 'img/pause-some.png';
	ICONS[ALL_SOURCES] = 'img/pause-all.png';


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	angular.module('TS').directive('tsSourceControls', ['geo', '$location', function (geo, $location) { ////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		var PATH_SCENARIO = $location.path().replace(/\-/g, ' ').substring(1);

//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		return { ///////////////////////////////////////////////////////////////////////////////////////////////////////
//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			restrict   : 'E',
			templateUrl: 'partials/tsControls/ts-source-controls.html',
			replace    : true,
			require    : '^tsMap',
			scope      : {},

			link: function (scope, element, attrs, controller) {


				////////////////////////////
				////// Display Button //////
				//////                //////


				controller.whenMapIsReady(function (map) {
					map.controls[gmaps.ControlPosition.TOP_LEFT].push(element[0]);
				});


				//////////////////////
				////// Counters //////
				//////          //////


				var _running = [];
				var _count = [];


				scope.count = function () {
					return _count[scope.scenario];
				};

				scope.running = function () {
					return _running[scope.scenario];
				};


				//////////////////////////////
				////// The Control Icon //////
				//////                  //////


				scope.controlIcon = function () {
					if (_running[scope.scenario] == 0) {
						return ICONS[NO_SOURCES];
					} else if (_running[scope.scenario] < _count[scope.scenario]) {
						return ICONS[SOME_SOURCES];
					} else {
						return ICONS[ALL_SOURCES];
					}
				};


				/////////////////////////////////////////////
				////// Gathering Scenarios and Sources //////
				//////                                 //////


				scope.scenarios = [];

				var _sources = [];

				controller.onScenarioRegistered(function (scenario) {
					//// Load the first scenario we encounter (so at least something is loaded)
					//
					if (scope.scenario === undefined) {
						scope.scenario = scenario;
					}

					//// If we don't know this scenario, add it to the collection
					//
					if (_sources[scenario] === undefined) {
						scope.scenarios.push(scenario);
						_sources[scenario] = [];
						_count[scenario] = 0;
						_running[scenario] = 0;
					}


					if (scenario == PATH_SCENARIO) {
						controller.whenMapIsReady(function () {
							scope.scenario = scenario;
						});
					}
				});

				controller.onSourceRegistered(function (source, scenario) {
					_sources[scenario].push(source);
					_count[scenario]++;
					source.onRun(function () { _running[scenario]++; });
					source.onPause(function () { _running[scenario]--; });
				});


				///////////////////////////////
				////// Control Functions //////
				//////                   //////


				scope.runAll = function (scenario) {
					if (scenario === undefined) {
						//noinspection AssignmentToFunctionParameterJS
						scenario = scope.scenario;
					}
					_sources[scenario].map(function (source) {
						source.run();
					});
				};

				scope.pauseAll = function (scenario) {
					if (scenario === undefined) {
						//noinspection AssignmentToFunctionParameterJS
						scenario = scope.scenario;
					}
					if (_sources[scenario] !== undefined) {
						_sources[scenario].map(function (source) {
							source.pause();
						});
					}
				};

				scope.runOrPauseAll = function (scenario) {
					if (scenario === undefined) {
						//noinspection AssignmentToFunctionParameterJS
						scenario = scope.scenario;
					}
					if (_running[scenario] == 0) { scope.runAll(scenario); }
					else { scope.pauseAll(scenario); }
				};


				////////////////////////////////
				////// Scenario Selection //////
				//////                    //////


				scope.$watch('scenario', function (newScenario, oldScenario) {
					//// Pause the old scenario
					//
					scope.pauseAll(oldScenario);

					//// Center in on the new one
					//
					if (_count[newScenario]) {
						controller.setCentering(controller.CENTERING_NOT);
						var bounds = new gmaps.LatLngBounds;
						_sources[newScenario].map(function (source) {
							bounds.extend(source.pos());
						});
						controller.map().fitBounds(bounds);
						//controller.map().setZoom(controller.map().getZoom()-1);

						// HACK!
						// TODO: Make it possible to encode such messages properly
						//
						if (newScenario == "Dam Square Experience") {
							var message = new InfoBox({
								content    : "<div class=\"content\"></div><button class=\"OK\">OK</button>",
								position   : controller.map().getCenter(),
								pixelOffset: new gmaps.Size(-240, -150)
							});

							message.open(controller.map());

							gmaps.event.addDomListenerOnce(message, 'domready', function () {

								$('.infoBox > .content').html(
										"<img style=\"display: block;\" src=\"img/Gezicht-op-de-Dam.jpg\">" +
										"<p style=\"font-size:12pt\">" +
										"The Dam Square Experience is made possible by the NWO project " +
										"<a style=\"font-size:12pt\" href=\"http://www.maastrichtsts.nl/?project=soundscapes-of-the-urban-past-staged-sound-as-mediated-cultural-heritage\">Soundscapes of the Urban Past</a>, " +
										"performed by the <a style=\"font-size:12pt\" href=\"http://www.maastrichtsts.nl\">STS&nbsp;research&nbsp;group</a> of Maastricht University." +
										"</p>");

								$('.infoBox > .OK').one('click', $.proxy(message.close, message)).one('click', function () {

									message.open(controller.map());

									gmaps.event.addDomListenerOnce(message, 'domready', function () {

										$('.infoBox > .OK').one('click', $.proxy(message.close, message));

										if (bounds.contains(geo.lastKnownPosition().toLatLng())) {
											$('.infoBox > .content').html(
													"<p style=\"font-size:12pt\">" +
													"I see you're already at the Dam. Great! " +
													"<emph>Click</emph> on the play button in the top left corner of your screen to start the experience:" +
													"</p>" +
													"<div style=\"text-align: center;\"><img style=\"border: solid 1px gray; padding: 4px; height: 16px; width: 16px\"\" src=\"img/run-all.png\"></div>" +
													"<p style=\"font-size:12pt\">You can then hear the sounds of the Dam relative to your current position.</p>");
										} else {
											$('.infoBox > .content').html(
													"<p style=\"font-size:12pt\">" +
													"<emph>Double click</emph> on an empty space on the map to simulate your presence there:" +
													"</p>" +
													"<div style=\"text-align: center\"><img src=\"img/marker-geomode-fake.png\"></div>" +
													"<p style=\"font-size:12pt\">" +
													"Then, <emph>click</emph> on the play button in the top left corner of your screen to start the experience:" +
													"</p>" +
													"<div style=\"text-align: center;\"><img style=\"border: solid 1px gray; padding: 4px; height: 16px; width: 16px\"\" src=\"img/run-all.png\"></div>" +
													"<p style=\"font-size:12pt\">You can then drag around the location marker to hear the sounds of the Dam relative to your current position.</p>");
										}
									});

								});

							});
						}
					}
				});

			}


//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		};//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	}]);////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
