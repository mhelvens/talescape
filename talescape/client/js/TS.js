'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'angular', 'MapCircle', 'gmaps'], function ($, angular, MapCircle) {
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

				///////////////////////////////
				////// Private variables //////
				//////                   //////

				var _map;
				var _options = {};

				var _locationMarker;
				var _locationMarkerAccuracyCircle;

				var _onNewUserPositionCallbacks = [];


				/////////////////////////////
				////// Private methods //////
				//////                 //////

				function _onNewPosition(position) {
					console.log(
							"GeoLocation registered:\n" +
							"- lat: " + position.coords.latitude + "\n" +
							"- lng: " + position.coords.longitude
					);

					position.latLng = new google.maps.LatLng(
							position.coords.latitude,
							position.coords.longitude
					);

					_placeLocationMarker(position);

					//_map.setCenter(position.latLng);

					for (var i in _onNewUserPositionCallbacks) {
						//noinspection JSUnfilteredForInLoop
						if (_onNewUserPositionCallbacks[i])
							_onNewUserPositionCallbacks[i](position);
					}
				}

				function _placeLocationMarker(position) {
					if (!_locationMarker) {
						_locationMarker = new google.maps.Marker({
							map      : _map,
							title    : "You Are Here",
							zIndex   : 3,
							draggable: false,
							editable : false,
							clickable: false,
							position : position.latLng,
							icon     : {
								url       : 'img/marker.png',
								size      : new google.maps.Size(96, 96),
								origin    : new google.maps.Point(0, 0),
								anchor    : new google.maps.Point(16, 16),
								scaledSize: new google.maps.Size(32, 32)
							}
						});
					}

					if (!_locationMarkerAccuracyCircle) {
						_locationMarkerAccuracyCircle = new google.maps.Circle({
							map          : _map,
							strokeColor  : '#4190da',
							strokeOpacity: 0.8,
							strokeWeight : 2,
							fillColor    : '#4190da',
							fillOpacity  : 0.35,
							draggable    : false,
							editable     : false,
							clickable    : false
						});
					}

					_locationMarker.setPosition(position.latLng);
					_locationMarkerAccuracyCircle.setCenter(position.latLng);

					//// parseFloat is used below for testing purposes only;
					//// The Chrome plugin to fake GPS location returns
					//// a string from position.coords.accuracy
					//
					_locationMarkerAccuracyCircle.setRadius(parseFloat(position.coords.accuracy));
				}


				/////////////////////////
				////// Constructor //////
				//////             //////

				//// Gather Options
				//
				$.extend(_options, {
					mapTypeId       : google.maps.MapTypeId.SATELLITE,              // default: satellite view
					disableDefaultUI: true,                                         // default: no controls
					styles: [
						{featureType: "all", elementType: "labels", stylers: [
							{visibility: "off"}
						]}
					],
					zoom            : 0,                                            // start zoom level
					center          : new google.maps.LatLng(52.3564841, 4.9520856) // start location (CWI)
				}, $scope.$eval($attrs['options']));


				//// Create the map
				//
				_map = new google.maps.Map($element.children(".canvas")[0], _options);


				//// Listen to user location
				//
				$.webshims.ready('geolocation', function () {
					// navigator.geolocation.getCurrentPosition(function(position) {
					// 	_map.setCenter(position.latLng)
					// }, function(error) {
					// 	// TODO: handle error getting initial position
					// });
					navigator.geolocation.watchPosition(_onNewPosition, function (error) {
						// TODO: handle error getting position
					}, { enableHighAccuracy: true, maximumAge: 1000 });
				});


				////////////////////////////
				////// Public methods //////
				//////                //////

				this.onNewUserPosition = function (handler) {
					// TODO: Use existing pubsub mechanism!
					var index = _onNewUserPositionCallbacks.push(handler) - 1;
					return function () {
						_onNewUserPositionCallbacks[index] = null;
					};
				};

				this.map = function () {
					return _map;
				};

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

				///////////////////////
				////// Constants //////
				//////	         //////

				var MOVE_IN_MARGIN = 0; // meters
				var MOVE_OUT_MARGIN = 4; // meters

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

						var _lat = parseFloat(attrs['lat'   ]);
						var _lng = parseFloat(attrs['lng'   ]);
						var _pos = new google.maps.LatLng(_lat, _lng); // convenience
						var _radius = parseInt(attrs['radius']);
						var _reach = parseInt(attrs['reach']);

						// TODO: Make sure (_radius < _reach)

						var _newPosUnsubscribe = null;

						var _audioElement = element.children('audio')[0];

						var _playing = false;
						var _userIsInside = false;


						/////////////////////////////
						////// Private methods //////
						//////                 //////

						//// Audio Controls
						//
						function _playAudio() { _audioElement.play(); }

						function _pauseAudio() { _audioElement.pause(); }

						function _setVolume(vol) { _audioElement.volume = vol; }

						function _stopAudio() {
							_audioElement.pause();
							_audioElement.currentTime = 0;
						}

						function _startPlayback() {
							if (!_playing) {
								_playing = true;
								_newPosUnsubscribe = controller.onNewUserPosition(_adaptToNewPosition);
								_playAudio();
								_mapCircle.start();
							}
						}

						function _pausePlayback() {
							if (_playing) {
								_playing = false;
								_newPosUnsubscribe();
								_pauseAudio();
								_mapCircle.stop();
							}
						}

						function _stopPlayback() {
							if (_playing) {
								_playing = false;
								_stopAudio();
								_mapCircle.stop();
							}
						}

						function _togglePlayback() {
							if (_playing) { _pausePlayback(); }
							else { _startPlayback(); }
						}

						function _adaptToNewPosition(newPosition) {
							var distance = google.maps.geometry.spherical
									.computeDistanceBetween(_pos, newPosition.latLng);

							var volume;

							if (distance < _radius) { volume = 1; }
							else if (distance > _reach) { volume = 0; }
							else {
								volume = 1 - Math.pow(distance - _radius, 2) /
								             Math.pow(_reach - _radius, 2);
							}

							_setVolume(volume);
						};


						/////////////////////////
						////// Constructor //////
						//////             //////

						$(_audioElement).one('playing', _pauseAudio);

						//// Implement the animation for the wave circles.
						//
						var _mapCircle = new MapCircle(controller.map(), _lat, _lng, _radius, _reach);

						//// Ways to toggle playback
						//
						_mapCircle.onClick(_togglePlayback);
					}
				};
			});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
