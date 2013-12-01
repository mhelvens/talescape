'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'gmaps', 'angular', 'infobox', 'TS', 'ts-map', 'geo'], function ($, gmaps, angular) { ////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	var NO_SOURCES = 0;
	var SOME_SOURCES = 1;
	var ALL_SOURCES = 2;

	var ICONS = [];
	ICONS[NO_SOURCES] = 'img/run-all.png';
	ICONS[SOME_SOURCES] = 'img/pause-some.png';
	ICONS[ALL_SOURCES] = 'img/pause-all.png';


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	angular.module('TS').directive('tsSourceControls', ['geo', '$location', '$rootScope', function (geo, $location, $rootScope) { ////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		var URL_SCENARIO = $location.path().replace(/\-/g, ' ').substring(1);

//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		return { ///////////////////////////////////////////////////////////////////////////////////////////////////////
//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			restrict   : 'E',
			templateUrl: 'partials/tsControls/ts-source-controls.html',
			replace    : true,
			require    : '^tsMap',
			scope      : {},

			link: function (scope, element, attrs, controller) {
				controller.map().then(function (map) {

					////////////////////////////
					////// Display Button //////
					//////                //////


					var index = map.controls[gmaps.ControlPosition.TOP_LEFT].push(element[0]) - 1;


					//////////////////////
					////// Counters //////
					//////          //////


					var _running = [];
					var _count = [];


					scope.count = function (scenario) {
						return _count[(scenario !== undefined) ? scenario : scope.scenario];
					};

					scope.running = function (scenario) {
						return _running[(scenario !== undefined) ? scenario : scope.scenario];
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

					_sources[null] = []; // for sources without scenario (not in scope.scenarios)
					_count[null] = 0;
					_running[null] = 0;

					scope.scenario = null;

					controller.onScenarioRegistered(function (scenario) {
						//// If we don't know this scenario, add it to the collection
						//
						if (_sources[scenario] === undefined) {
							scope.scenarios.push(scenario);
							_sources[scenario] = [];
							_count[scenario] = 0;
							_running[scenario] = 0;
						}


						if (scenario === URL_SCENARIO) {
							scope.scenario = scenario;
						}
					});

					controller.onSourceRegistered(function (source, scenario) {
						_sources[scenario].push(source);
						_count[scenario]++;
						source.onRun(function () {
							_running[scenario]++;
						});
						source.onPause(function () {
							_running[scenario]--;
						});
					});


					///////////////////////////////
					////// Control Functions //////
					//////                   //////


					scope.runAll = function (scenario) {
						var sc = (scenario !== undefined) ? scenario : scope.scenario;
						_sources[sc].map(function (source) {
							source.run();
						});
					};

					scope.pauseAll = function (scenario) {
						var sc = (scenario !== undefined) ? scenario : scope.scenario;
						if (_sources[sc] !== undefined) { // TODO: necessary?
							_sources[sc].map(function (source) {
								source.pause();
							});
						}
					};

					scope.runOrPauseAll = function (scenario) {
						var sc = (scenario !== undefined) ? scenario : scope.scenario;
						if (scope.running(sc)) {
							scope.pauseAll(sc);
						} else {
							scope.runAll(sc);
						}
					};


					/////////////////////////////////////////
					////// Force Redraw when Necessary //////
					//////                             //////


					function redraw() {
						if (index !== undefined) {
							map.controls[gmaps.ControlPosition.TOP_LEFT].push($('<div>')[0]);
							map.controls[gmaps.ControlPosition.TOP_LEFT].pop();
						}
					}

					scope.$watch('scenario', redraw);
					scope.$watch('count()', redraw);
					scope.$watch('running()', redraw);


					////////////////////////////////
					////// Scenario Selection //////
					//////                    //////


					var infoWindowsSeen = [];

					scope.$watch('scenario', function (newScenario, oldScenario) {
						//// Pause the old scenario
						//
						scope.pauseAll(oldScenario);

						//// Set the subtitle
						//
						$rootScope.subtitle = newScenario;

						//// Center in on the new one
						//
						if (newScenario && _count[newScenario]) {
							controller.setCentering(controller.CENTERING_NOT);
							var bounds = new gmaps.LatLngBounds;
							_sources[newScenario].map(function (source) {
								bounds.extend(source.pos());
							});
							map.fitBounds(bounds);
							//map.setZoom(map.getZoom()-1);

							// HACK!
							// TODO: Make it possible to encode such messages properly
							// TODO: This isn't really in the right place either
							//
							if (!infoWindowsSeen[newScenario] && newScenario === "Dam Square Experience") {
								infoWindowsSeen[newScenario] = true;
								var messageBox = new InfoBox({
									content    : "<div class=\"content\"></div><button class=\"OK\">OK</button>",
									position   : map.getCenter(),
									pixelOffset: new gmaps.Size(-240, -150)
								});

								messageBox.open(map);

								gmaps.event.addDomListenerOnce(messageBox, 'domready', function () {

									var messages = [
										("<img style=\"display: block;\" src=\"img/Gezicht-op-de-Dam.jpg\">" +
										 "<p style=\"font-size:12pt\">" +
										 "    The Dam Square Experience is made possible by the NWO project " +
										 "    <a style=\"font-size:12pt\" href=\"http://www.maastrichtsts.nl/?project=soundscapes-of-the-urban-past-staged-sound-as-mediated-cultural-heritage\">Soundscapes of the Urban Past</a>, " +
										 "    performed by the <a style=\"font-size:12pt\" href=\"http://www.maastrichtsts.nl\">STS&nbsp;research&nbsp;group</a> of Maastricht University." +
										 "</p>"),


										(bounds.contains(geo.lastKnownPosition().toLatLng())
												?
                                         "<p style=\"font-size:12pt\">" +
                                         "    I see you're already at the Dam. Great!" +
                                         "    <emph>Click</emph> on the play button in the top left corner of your screen to start the experience:" +
                                         "</p>" +
                                         "<div style=\"text-align: center;\">" +
                                         "    <img style=\"border: solid 1px gray; padding: 4px; height: 16px; width: 16px\"\" src=\"img/run-all.png\">" +
                                         "</div>" +
                                         "<p style=\"font-size:12pt\">" +
                                         "    You can then hear the sounds of the Dam relative to your current position." +
                                         "</p>"
												:
                                         "<p style=\"font-size:12pt\">" +
                                         "<emph>Double click</emph> on an empty space on the map to simulate your presence at that location:" +
                                         "</p>" +
                                         "<div style=\"text-align: center\"><img src=\"img/marker-geomode-fake.png\"></div>" +
                                         "<p style=\"font-size:12pt\">" +
                                         "Then, <emph>click</emph> on the play button in the top left corner of your screen to start the experience:" +
                                         "</p>" +
                                         "<div style=\"text-align: center;\">" +
                                         "    <img style=\"border: solid 1px gray; padding: 4px; height: 16px; width: 16px\"\" src=\"img/run-all.png\">" +
                                         "</div>" +
                                         "<p style=\"font-size:12pt\">" +
                                         "    You can then drag around the location marker to hear the sounds of the Dam relative to your current position." +
                                         "</p>"),


										("<p style=\"font-size:12pt\">" +
										 "    This button, in the top left corner of the screen, allows you to switch between a simulated and a real GPS position:" +
										 "</p>" +
										 "<div style=\"text-align: center; font-size: 24px\">" +
										 "    <img style=\"vertical-align: -50%; display: inline-block; border: solid 1px gray; padding: 4px; height: 16px; width: 16px\"\" src=\"img/geomode-fake.png\">" +
										 "    ⇔" +
										 "    <img style=\"vertical-align: -50%; display: inline-block; border: solid 1px gray; padding: 4px; height: 16px; width: 16px\"\" src=\"img/geomode-real.png\">" +
										 "</div>" +
										 "<p style=\"font-size:12pt\">" +
										 "    And this one switches between allowing free exploration of the map, and keeping it centered on your current position:" +
										 "</p>" +
										 "<div style=\"text-align: center; font-size: 24px; margin-bottom: 15px\">" +
										 "    <img style=\"vertical-align: -50%; display: inline-block; border: solid 1px gray; padding: 4px; height: 16px; width: 16px\"\" src=\"img/centering-not.png\">" +
										 "    ⇔" +
										 "    <img style=\"vertical-align: -50%; display: inline-block; border: solid 1px gray; padding: 4px; height: 16px; width: 16px\"\" src=\"img/centering-user.png\">" +
										 "</div>")
									];


									var contentDiv = $('.infoBox > .content');
									var okButton = $('.infoBox > .OK');

									var screen = 0;

									function screenStep() {
										if (screen < messages.length) {
											contentDiv.html(messages[screen]);
										} else {
											okButton.off();
											messageBox.close.call(messageBox);
										}
										++screen;
									}

									screenStep();

									okButton.click(screenStep);
								});
							}
						}
					});
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
