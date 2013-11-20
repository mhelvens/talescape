'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'angular', 'SoundSource', 'AudioPlayer', 'gmaps'], function ($, angular, SoundSource, AudioPlayer) {//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	//// Angular Talescape Main Module
	//
	var TS = angular.module('TS', [])


		////////////////////////////////////////////////////////////
		// ApplicationController ///////////////////////////////////
		////////////////////////////////////////////////////////////


			.controller('ApplicationController', ['$scope', function ($scope) {
				$scope.title = 'Talescape';
			}])


		////////////////////////////////////////////////////////////
		// MapController ///////////////////////////////////////////
		////////////////////////////////////////////////////////////


			.controller('MapController', ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {


				////////////////////////////
				////// Public methods //////
				//////                //////


				this.onNewUserPos = function (handler) {
					_newUserPosCallbacks.add(handler);
				};

				this.userPos = function () {
					return _userPos || undefined;
				};

				this.map = function () {
					return _map;
				};


				///////////////////////////////
				////// Private variables //////
				//////                   //////


				var _newUserPosCallbacks = $.Callbacks('unique');


				/////////////////////////
				////// Constructor //////
				//////             //////


				//// Gather Options
				//
				var options = $.extend({
					mapTypeId       : google.maps.MapTypeId.SATELLITE,  // default: satellite view
					disableDefaultUI: true,                             // default: no controls
					styles          : [
						{featureType: "all", elementType: "labels", stylers: [
							{visibility: "off"}
						]}
					]
				}, { // user configurable options
					zoom  : parseInt($attrs['zoom']) || 20,           // start zoom level
					center: new google.maps.LatLng(
							parseFloat($attrs['lat']) || 52.3564841,
							parseFloat($attrs['lng']) || 4.9520856)   // start location (default: CWI)
				});


				//// Create the map using those options
				//
				var _map = new google.maps.Map($element.children(".canvas")[0], options);


				//// Listen to user location
				//
				$.webshims.ready('geolocation', function () {
					navigator.geolocation.watchPosition(_onNewUserPosition, function (error) {
						console.error(error.message);
					}, { enableHighAccuracy: true, maximumAge: 500});
				});


				/////////////////////////////
				////// Private methods //////
				//////                 //////


				var _userPos;

				function _onNewUserPosition(userPos) {
					if (!_userPos || (_userPos.coords.latitude != userPos.coords.latitude ||
					                  _userPos.coords.longitude != userPos.coords.longitude ||
					                  _userPos.coords.accuracy != userPos.coords.accuracy)) {
						_userPos = userPos;

						console.log(
								"GeoLocation registered:\n" +
								"- latitude:  " + _userPos.coords.latitude + "\n" +
								"- longitude: " + _userPos.coords.longitude + "\n" +
								"- accuracy:  " + _userPos.coords.accuracy
						);

						_userPos.latLng = new google.maps.LatLng(
								_userPos.coords.latitude,
								_userPos.coords.longitude
						);

						_placeLocationMarker(_userPos);

						_map.setCenter(userPos.latLng);

						_newUserPosCallbacks.fire(_userPos);
					}
				}

				var _locationMarker;
				var _locationMarkerAccuracyCircle;

				function _placeLocationMarker(userPos) {
					if (!_locationMarker) {
						_locationMarker = new google.maps.Marker({
							map      : _map,
							title    : "You Are Here",
							zIndex   : 999, // always on the foreground
							draggable: false,
							editable : false,
							clickable: false,
							position : userPos.latLng,
							icon     : {
								url   : '//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
								size  : new google.maps.Size(22, 22),
								origin: new google.maps.Point(0, 18),
								anchor: new google.maps.Point(11, 11)
							}
						});

						_locationMarkerAccuracyCircle = new google.maps.Circle({
							map          : _map,
							strokeColor  : '#4190da',
							strokeOpacity: 0.8,
							strokeWeight: 1,
							fillColor    : '#4190da',
							fillOpacity : 0.45,
							draggable    : false,
							editable     : false,
							clickable    : false
						});
					}

					_locationMarker.setPosition(userPos.latLng);
					_locationMarkerAccuracyCircle.setCenter(userPos.latLng);

					//// parseFloat is used below for testing purposes only;
					//// The Chrome plugin to fake GPS location returns
					//// a string from userPos.coords.accuracy
					//
					_locationMarkerAccuracyCircle.setRadius(parseFloat(userPos.coords.accuracy));
				}


				////////////////////////////////////////////////////
				////// Functionality to add Circles and Paths //////
				//////                                        //////

				var editableRadiusOptions = {
					map           : _map,
					clickable     : false,
					draggable     : true,
					editable      : true,
					fillColor     : 'yellow',
					fillOpacity   : 0.4,
					strokeColor   : 'yellow',
					strokeOpacity : 0.9,
					strokePosition: google.maps.INSIDE,
					strokeWeight  : 4,
					zIndex        : 12, // radius circle must appear in front of reach circle and path
					visible       : true
				};

				var editableReachOptions = {
					map           : _map,
					clickable     : false,
					draggable     : false,
					editable      : true,
					fillOpacity   : 0,
					strokeColor   : 'yellow',
					strokeOpacity : 0.9,
					strokePosition: google.maps.OUTSIDE,
					strokeWeight  : 1,
					zIndex        : 11,
					visible       : true
				};

				var editablePathOptions = {
					clickable    : false,
					draggable    : true,
					editable     : true,
					strokeColor  : 'yellow',
					strokeOpacity: 0.9,
					strokeWeight : 2,
					zIndex       : 11,
					visible      : true,
					icons        : [
						{
							offset: '100%',
							icon  : {
								path        : google.maps.SymbolPath.FORWARD_OPEN_ARROW,
								strokeWeight: 2,
								scale       : 4
							}
						}
					]
				};

				var _drawingManager = new google.maps.drawing.DrawingManager({
					map                  : _map,
					circleOptions        : editableRadiusOptions,
					polylineOptions      : editablePathOptions,
					drawingControlOptions: { drawingModes: [
						google.maps.drawing.OverlayType.CIRCLE,
						google.maps.drawing.OverlayType.POLYLINE
					] }
				});


//				var overlay = new google.maps.OverlayView();
//				overlay.draw = function() {};
//				overlay.setMap(_map);
//				var p = overlay.getProjection().fromLatLngToContainerPixel(radiusCircle.getCenter());
//				$(_map).trigger($.Event('click', { pageX: p.x, pageY: p.y }));


				var _newSources = [];

				google.maps.event.addListener(_drawingManager, 'circlecomplete', function (radiusCircle) {
					var newSource = {
						radius: radiusCircle,
						reach : new google.maps.Circle($.extend({
							center: radiusCircle.getCenter(),
							radius: radiusCircle.getRadius() + 30 * Math.pow(2, 18 - _map.getZoom())
						}, editableReachOptions))
					};

					_prepareEditableSource(newSource);

					_logNewSourceInfo();
				});

				google.maps.event.addListener(_drawingManager, 'polylinecomplete', function (path) {
					var center = path.getPath().getAt(0);
					var newSource = {
						path  : path,
						radius: new google.maps.Circle($.extend({
							center: center,
							radius: 10 * Math.pow(2, 18 - _map.getZoom())
						}, editableRadiusOptions)),
						reach : new google.maps.Circle($.extend({
							center: center,
							radius: (10 + 30) * Math.pow(2, 18 - _map.getZoom())
						}, editableReachOptions))
					};

					_prepareEditableSource(newSource);

					google.maps.event.addListener(newSource.radius, 'center_changed', function () {
						newSource.path.getPath().setAt(0, newSource.radius.getCenter());
						_logNewSourceInfo();
					});

					google.maps.event.addListener(path.getPath(), 'insert_at', function () { _logNewSourceInfo(); });
					google.maps.event.addListener(path.getPath(), 'remove_at', function () { _logNewSourceInfo(); });
					google.maps.event.addListener(path.getPath(), 'set_at', function () { _logNewSourceInfo(); });

					_logNewSourceInfo();
				});

				var OKtoLog = true;

				function _logNewSourceInfo() {
					if (OKtoLog) {
						OKtoLog = false;
						window.setTimeout(function () { OKtoLog = true; }, 100);
						console.debug("----------------------------------------");
						_newSources.map(function (s) {
							console.debug('<ts-area lat="{{1}}" lng="{{2}}" radius="{{3}}" reach="{{4}}"{{5}} audio=""></ts-area>'
									.format(s.radius.getCenter().lat(),
											s.radius.getCenter().lng(),
											s.radius.getRadius(),
											s.reach.getRadius(),
											!s.path ? "" :
											' path="' + google.maps.geometry.encoding.encodePath(s.path.getPath())
													.replace(/(\\|")/g, '\\$1') + '"'));
						});
						console.debug("----------------------------------------");
					}
				}


				function _prepareEditableSource(newSource) {
					google.maps.event.addListener(newSource.radius, 'center_changed', function () {
						newSource.reach.setCenter(newSource.radius.getCenter());
						_logNewSourceInfo();
					});

					google.maps.event.addListener(newSource.radius, 'radius_changed', function () {
						if (newSource.reach.getRadius() < newSource.radius.getRadius() + 5) {
							newSource.reach.setRadius(newSource.radius.getRadius() + 5);
						}
						_logNewSourceInfo();
					});

					google.maps.event.addListener(newSource.reach, 'radius_changed', function () {
						if (newSource.reach.getRadius() < newSource.radius.getRadius() + 5) {
							newSource.radius.setRadius(Math.max(2, newSource.reach.getRadius() - 5));
						}
						_logNewSourceInfo();
					});

					google.maps.event.addListener(newSource.radius, 'center_changed', function () {
						newSource.reach.setCenter(newSource.radius.getCenter());
						_logNewSourceInfo();
					});

					return _newSources.push(newSource);
				}


			}])


		////////////////////////////////////////////////////////////
		// 'ts-map' Directive //////////////////////////////////////
		////////////////////////////////////////////////////////////


			.directive('tsMap', function () {
				return {
					controller : 'MapController',
					restrict   : 'E',
					templateUrl: 'partials/tsMap/tsMap.html',
					replace    : true,
					transclude : true,
					scope      : {}
				};
			})


		////////////////////////////////////////////////////////////
		// 'ts-area' Directive /////////////////////////////////////
		////////////////////////////////////////////////////////////


			.directive('tsArea', function () {
				return {
					restrict   : 'E',
					templateUrl: 'partials/tsArea/tsArea.html',
					replace    : true,
					scope      : {audio: '@'},
					require    : '^tsMap',

					link: function (scope, element, attrs, controller) {


						///////////////////////////////
						////// Private variables //////
						//////                   //////

						var _loudness = parseFloat(attrs['loudness']);

						var _soundSource = new SoundSource(
								controller.map(),
								parseFloat(attrs['lat']),
								parseFloat(attrs['lng']),
								parseFloat(attrs['radius']),
								parseFloat(attrs['reach']),
								attrs['path']);

						var _audio = new AudioPlayer(
								element.children('audio')[0]);

						var _playing = false;


						/////////////////////////
						////// Constructor //////
						//////             //////


						//// Click to toggle playback
						//
						_soundSource.onClick(_toggle);

						//// Continuously adjust volume
						//
						_adaptVolume();
						controller.onNewUserPos(_adaptVolume);
						_soundSource.onNewPos(_adaptVolume);


						/////////////////////////////
						////// Private methods //////
						//////                 //////


						function _start() {
							if (!_playing) {
								_playing = true;
								_audio.loop();
								_soundSource.start();
								_adaptVolume();
							}
						}

						function _pause() {
							if (_playing) {
								_playing = false;
								_audio.pause();
								_soundSource.stop();
							}
						}

						function _toggle() {
							if (_playing) { _pause(); } else { _start(); }
						}

						function _linearProgression(close, far, here) {
							return (here - close) / (far - close);
						}

						function _quadraticProgression(close, far, here) {
							return Math.pow(here - close, 2) /
							       Math.pow(far - close, 2);
						}

						function _adaptVolume() {
							var volume;

							if (!controller.userPos()) {
								volume = 0;
							} else {
								var distance = google.maps.geometry.spherical.computeDistanceBetween(
										_soundSource.pos(),
										controller.userPos().latLng
								);

								if (distance > _soundSource.reach()) { volume = 0; }
								else if (distance < _soundSource.radius()) { volume = 1; }
								else {
									volume = 1 - _quadraticProgression(
											_soundSource.radius(),
											_soundSource.reach(),
											distance);
								}
							}

							volume *= _loudness;

							_audio.setVolume(volume);
						}

					}
				};
			});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
