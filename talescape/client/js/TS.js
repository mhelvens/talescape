'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'angular', 'MapCircle', 'AudioPlayer', 'gmaps'], function ($, angular, MapCircle, AudioPlayer) {
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

				var _zoom = parseInt($attrs['zoom']);
				var _lat = parseFloat($attrs['lat']);
				var _lng = parseFloat($attrs['lng']);

				var _userPos; // to cache

				var _locationMarker;
				var _locationMarkerAccuracyCircle;

				var _onNewUserPositionCallbacks = [];


				/////////////////////////////
				////// Private methods //////
				//////                 //////

				function _onNewUserPosition(userPos) {
					if (!_userPos || _userPos.coords != userPos.coords) {
						_userPos = userPos;

						console.log(
								"GeoLocation registered:\n" +
								"- lat: " + _userPos.coords.latitude + "\n" +
								"- lng: " + _userPos.coords.longitude
						);

						_userPos.latLng = new google.maps.LatLng(
								userPos.coords.latitude,
								userPos.coords.longitude
						);

						_placeLocationMarker(userPos);

						//_map.setCenter(userPos.latLng);

						for (var i in _onNewUserPositionCallbacks) {
							if (_onNewUserPositionCallbacks.hasOwnProperty(i))
								_onNewUserPositionCallbacks[i](_userPos);
						}
					}
				}

				function _placeLocationMarker(userPos) {
					if (!_locationMarker) {
						_locationMarker = new google.maps.Marker({
							map      : _map,
							title    : "You Are Here",
							zIndex   : 3,
							draggable: false,
							editable : false,
							clickable: false,
							position: userPos.latLng,
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

					_locationMarker.setPosition(userPos.latLng);
					_locationMarkerAccuracyCircle.setCenter(userPos.latLng);

					//// parseFloat is used below for testing purposes only;
					//// The Chrome plugin to fake GPS location returns
					//// a string from userPos.coords.accuracy
					//
					_locationMarkerAccuracyCircle.setRadius(parseFloat(userPos.coords.accuracy));
				}


				/////////////////////////
				////// Constructor //////
				//////             //////

				//// Gather Options
				//
				var options = $.extend({
					mapTypeId       : google.maps.MapTypeId.SATELLITE,              // default: satellite view
					disableDefaultUI: true,                                         // default: no controls
					styles: [
						{featureType: "all", elementType: "labels", stylers: [
							{visibility: "off"}
						]}
					]
				}, { // user configurable options
					zoom  : _zoom || 12,                                                  // start zoom level
					center: new google.maps.LatLng(_lat || 52.3564841, _lng || 4.9520856) // start location (default: CWI)
				});


				//// Create the map using those options
				//
				_map = new google.maps.Map($element.children(".canvas")[0], options);


				//// Listen to user location
				//
				$.webshims.ready('geolocation', function () {
					navigator.geolocation.getCurrentPosition(function (userPos) {
						_onNewUserPosition(userPos);
						_map.setCenter(userPos.latLng);
					}, function (error) {
						// TODO: handle error getting initial position
					}, { enableHighAccuracy: true, maximumAge: 0 });
					navigator.geolocation.watchPosition(_onNewUserPosition, function (error) {
						// TODO: handle error getting position
					}, { enableHighAccuracy: true});
				});


				////////////////////////////
				////// Public methods //////
				//////                //////

				this.onNewUserPos = function (handler) {
					// TODO: Use existing pubsub mechanism!
					_onNewUserPositionCallbacks.push(handler);
					if (_userPos) handler(_userPos);
				};

				this.userPos = function () {
					return _userPos || null;
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

						var _lat = parseFloat(attrs['lat']);
						var _lng = parseFloat(attrs['lng']);
						var _radius = parseInt(attrs['radius']);
						var _reach = parseInt(attrs['reach']);

						// TODO: Make sure (_radius < _reach)
						// TODO: Store the above fields in _mapCircle only, and retrieve them there

						var _mapCircle = new MapCircle(controller.map(), _lat, _lng, _radius, _reach);

						var _audio = new AudioPlayer(element.children('audio')[0]);

						var _playing = false;


						/////////////////////////
						////// Constructor //////
						//////             //////


						//// Click to toggle playback
						//
						_mapCircle.onClick(_toggle);

						//// Request position updates to adjust volume
						//
						controller.onNewUserPos(_adaptVolume);


						/////////////////////////////
						////// Private methods //////
						//////                 //////


						function _start() {
							if (!_playing) {
								_playing = true;
								_audio.loop();
								_mapCircle.start();
								_adaptVolume(controller.userPos());
							}
						}

						function _pause() {
							if (_playing) {
								_playing = false;
								_audio.pause();
								_mapCircle.stop();
							}
						}

						function _toggle() {
							if (_playing) { _pause(); } else { _start(); }
						}

						function _adaptVolume(userPos) {
							var volume;

							if (!userPos) {
								volume = 0;
							} else {
								var distance = google.maps.geometry.spherical.computeDistanceBetween(
										new google.maps.LatLng(_lat, _lng),
										userPos.latLng
								);

								if (distance > _reach) { volume = 0; }
								else if (distance < _radius) { volume = 1; }
								else {
									volume = 1 - Math.pow(distance - _radius, 2) /
									             Math.pow(_reach - _radius, 2);
								}
							}

							_audio.setVolume(volume);
						}

					}
				};
			});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
