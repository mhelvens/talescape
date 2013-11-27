'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'gmaps', 'angular', 'TS', 'ts-map'], function ($, gmaps, angular) { //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	angular.module('TS').directive('tsSourceEditor', [function () { ////////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		return { ///////////////////////////////////////////////////////////////////////////////////////////////////////
//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			restrict   : 'E',
			templateUrl: 'partials/tsControls/ts-source-editor.html',
			replace    : true,
			require    : '^tsMap',
			scope      : {},

			link: function (scope, element, attrs, controller) {


				////////////////////////////////////////////
				////// Setting up the Drawing Manager //////
				//////                                //////


				var COMMON_DRAWING_OPTIONS = {
					map          : controller.map(),
					strokeColor  : 'yellow',
					strokeOpacity: 0.9,
					visible      : true,
					clickable    : false,
					draggable    : false,
					editable     : false
				};

				var DRAWING_RADIUS_OPTIONS = $.extend({}, COMMON_DRAWING_OPTIONS, {
					fillOpacity : 0.4,
					fillColor   : 'yellow',
					strokeWeight: 4,
					zIndex      : 12 // radius circle must appear in front of reach circle and path
				});

				var DRAWING_REACH_OPTIONS = $.extend({}, COMMON_DRAWING_OPTIONS, {
					fillOpacity  : 0,
					strokeWeight : 1,
					strokeOpacity: 0.6,
					zIndex       : 11
				});

				var ARROW_ICON = { path: gmaps.SymbolPath.FORWARD_CLOSED_ARROW };
				var CIRCLE_ICON = { path: gmaps.SymbolPath.CIRCLE };

				var DRAWING_PATH_OPTIONS = $.extend({}, COMMON_DRAWING_OPTIONS, {
					strokeWeight: 2,
					zIndex      : 11,
					icons       : [
						{ icon: CIRCLE_ICON, offset: '0%' },
						{ icon: ARROW_ICON, offset: '25%' },
						{ icon: ARROW_ICON, offset: '50%' },
						{ icon: ARROW_ICON, offset: '75%' },
						{ icon: ARROW_ICON, offset: '100%' }
					]
				});


				var _drawingManager = new gmaps.drawing.DrawingManager({
					map            : controller.map(),
					drawingControl : false,
					circleOptions  : DRAWING_RADIUS_OPTIONS,
					polylineOptions: DRAWING_PATH_OPTIONS
				});


				///////////////////
				////// Modes //////
				//////       //////


				$.extend(scope, {
					EDIT      : 'EDIT',
					ADD_STATIC: 'ADD_STATIC',
					ADD_PATH  : 'ADD_PATH'
				});


				//////////////////////
				////// Controls //////
				//////          //////


				var MODE_ICONS = [];

				MODE_ICONS[scope.EDIT] = [];
				MODE_ICONS[scope.EDIT][false] = 'img/mode-edit-off.png';
				MODE_ICONS[scope.EDIT][true] = 'img/mode-edit-on.png';

				MODE_ICONS[scope.ADD_STATIC] = [];
				MODE_ICONS[scope.ADD_STATIC][false] = 'img/mode-add-static-off.png';
				MODE_ICONS[scope.ADD_STATIC][true] = 'img/mode-add-static-on.png';

				MODE_ICONS[scope.ADD_PATH] = [];
				MODE_ICONS[scope.ADD_PATH][false] = 'img/mode-add-path-off.png';
				MODE_ICONS[scope.ADD_PATH][true] = 'img/mode-add-path-on.png';


				scope.buttonIcon = function (mode) { return MODE_ICONS[mode][mode == scope.mode]; };


				scope.setMode = function (mode) {
					scope.mode = mode;
					if (scope.mode != scope.EDIT) {
						_startTheDrawingProcess();
					}
				};


				//////////////////////////////////////
				////// Adding new Sound Sources //////
				//////                          //////


				function _startTheDrawingProcess() {

					var newSource = {};
					var listeners = [];


					function startUp() {
						drawRadius();
					}


					function drawRadius() {
						//// Drawing the radius uses drawing mode (for now)
						//
						_drawingManager.setDrawingMode(gmaps.drawing.OverlayType.CIRCLE);

						//// When the radius is complete, start drawing the reach
						//
						listeners.push(gmaps.event.addListenerOnce(_drawingManager, 'circlecomplete', function (radiusCircle) {
							newSource.radius = radiusCircle;
							cleanUpIntermediate();
							drawReach();
						}));
					}


					function drawReach() {
						//// This is not done with drawing mode, but 'manually' with events
						//
						_drawingManager.setDrawingMode(null);
						controller.map().setOptions({ draggableCursor: "url(//maps.gstatic.com/mapfiles/crosshair.cur) 7 7, crosshair" });

						//// Set initial reach used during the edit
						//
						newSource.reach = new gmaps.Circle($.extend({
							center: newSource.radius.getCenter(),
							radius: newSource.radius.getRadius()
						}, DRAWING_REACH_OPTIONS));

						//// Move the reach circle along with mouse moves during the edit
						//
						listeners.push(gmaps.event.addListener(controller.map(), 'mousemove', function (mouseEvent) {
							var distance = gmaps.geometry.spherical.computeDistanceBetween(newSource.radius.getCenter(), mouseEvent.latLng);
							if (distance > newSource.reach.getRadius() || distance > newSource.radius.getRadius() + 5) {
								newSource.reach.setRadius(distance);
							}
						}));

						//// Permanently set the reach on click; start next phase
						//
						listeners.push(gmaps.event.addListenerOnce(controller.map(), 'click', function (mouseEvent) {
							var distance = gmaps.geometry.spherical.computeDistanceBetween(newSource.radius.getCenter(), mouseEvent.latLng);
							mouseEvent.stop();
							newSource.reach.setRadius(Math.max(distance, newSource.radius.getRadius() + 5));

							if (scope.mode == scope.ADD_PATH) {
								cleanUpIntermediate();
								drawPath(mouseEvent.latLng);
							} else {
								finishUp();
							}
						}));
					}


					function drawPath(secondPoint) {
						//// This is not done with drawing mode, but 'manually' with events
						//
						_drawingManager.setDrawingMode(null);
						controller.map().setOptions({ draggableCursor: "url(//maps.gstatic.com/mapfiles/crosshair.cur) 7 7, crosshair" });
						newSource.radius.setOptions({ clickable: true });

						//// Set initial path used during the edit
						//
						newSource.path = new gmaps.Polyline($.extend({
							path: [
								newSource.radius.getCenter(),
								secondPoint
							]
						}, DRAWING_PATH_OPTIONS));

						function setLastPointTo(latLng) {
							newSource.path.getPath().setAt(newSource.path.getPath().getLength() - 1, latLng);
						}

						//// Move the last coordinate with the mouse as it moves
						//
						listeners.push(gmaps.event.addListener(controller.map(), 'mousemove', function (mouseEvent) {
							setLastPointTo(mouseEvent.latLng);
						}));

						//// Add a new segment to the path on a click
						//
						listeners.push(gmaps.event.addListener(controller.map(), 'click', function (mouseEvent) {
							newSource.path.getPath().push(mouseEvent.latLng);
						}));

						//// Remove the last segment of the path on a right-click
						//
						listeners.push(gmaps.event.addListener(controller.map(), 'rightclick', function (mouseEvent) {
							mouseEvent.stop();
							if (newSource.path.getPath().getLength() > 2) {
								newSource.path.getPath().pop();
								setLastPointTo(mouseEvent.latLng);
							}
						}));

						//// Permanently set the path on double-click; start next phase (cleanup)
						//
						listeners.push(gmaps.event.addListener(controller.map(), 'dblclick', function (mouseEvent) {
							mouseEvent.stop();
							newSource.path.getPath().pop(); // remove redundant segment caused by double-click
							finishUp();
						}));

						//// Permanently set the path on double-click; start next phase (cleanup)
						//
						listeners.push(gmaps.event.addListener(newSource.radius, 'click', function (mouseEvent) {
							mouseEvent.stop();
							setLastPointTo(newSource.radius.getCenter());
							finishUp();
						}));
					}


					function finishUp() {
						scope.$apply(function () {
							_newSources.push(newSource);

							prepareForEdits();

							cleanUpFinal();

							_logNewSourceInfo();

							scope.setMode(scope.EDIT);
						});
					}


					function prepareForEdits() {
						newSource.radius.setOptions({ clickable: true });
						newSource.audio = {};
						gmaps.event.addListener(newSource.radius, 'dblclick', function (mouseEvent) {
							mouseEvent.stop();
							newSource.audio.src = prompt("Audio File", (newSource.audio.src || ""));
						});
					}


					function cleanUpFinal() {
						cleanUpIntermediate();
						gmaps.event.clearInstanceListeners(_drawingManager);
						_drawingManager.setDrawingMode(null);
						controller.map().setOptions({ draggableCursor: null });
					}


					function cleanUpIntermediate() {
						listeners.map(function (listener) {
							if (listener) {
								gmaps.event.removeListener(listener);
							}
						});
						listeners = [];
					}


					//// Start the process
					//
					startUp();
				}


				////////////////////////
				////// Initialize //////
				//////            //////


				scope.setMode(scope.EDIT);


				/////////////////////////////
				////// Display Buttons //////
				//////                 //////


				controller.map().controls[gmaps.ControlPosition.TOP_LEFT].push(element[0]);


				///////////////////////////////////////
				////// Logging new Sound Sources //////
				//////                           //////


				var _newSources = [];
				var _OKtoLog = true;

				function _logNewSourceInfo() {
					if (_OKtoLog) {
						_OKtoLog = false;
						window.setTimeout(function () { _OKtoLog = true; }, 100);
						console.debug("----------------------------------------");
						_newSources.map(function (s) {
							if (s.path) {
								console.debug(('<ts-area radius="{{1}}" reach="{{2}}" path="{{3}}" loudness="1">' +
								               '<source src="{{4}}" type="audio/mp3">' +
								               '</ts-area>')
										.format(s.radius.getRadius(),
												s.reach.getRadius(),
												gmaps.geometry.encoding.encodePath(s.path.getPath())
														.replace('"', '&quot;'),
												s.audio.src || ""));
							} else {
								console.debug(('<ts-area lat="{{1}}" lng="{{2}}" radius="{{3}}" reach="{{4}}" loudness="1">' +
								               '<source src="{{5}}" type="audio/mp3">' +
								               '</ts-area>')
										.format(s.radius.getCenter().lat(),
												s.radius.getCenter().lng(),
												s.radius.getRadius(),
												s.reach.getRadius(),
												s.audio.src || ""));
							}
						});
						console.debug("----------------------------------------");
					}
				}
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
