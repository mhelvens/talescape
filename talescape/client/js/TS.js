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

					_map.setCenter(position.latLng);

					for (var i in _onNewUserPositionCallbacks) {
						//noinspection JSUnfilteredForInLoop
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
					_locationMarkerAccuracyCircle.setRadius(position.coords.accuracy);
				}


				/////////////////////////
				////// Constructor //////
				//////             //////

				//// Gather Options
				//
				$.extend(_options, {
					mapTypeId       : google.maps.MapTypeId.SATELLITE,              // default: satellite view
					disableDefaultUI: true,                                         // default: no controls
					zoom            : 0,                                            // start zoom level
					center          : new google.maps.LatLng(52.3564841, 4.9520856) // start location (CWI)
				}, $scope.$eval($attrs['options']));


				//// Create the map
				//
				_map = new google.maps.Map($element.children(".canvas")[0], _options);


				//// Listen to user location
				//
				$.webshims.ready('geolocation', function () {
					navigator.geolocation.watchPosition(_onNewPosition);
				});


				////////////////////////////
				////// Public methods //////
				//////                //////

				this.onNewUserPosition = function (handler) {
					_onNewUserPositionCallbacks.push(handler);
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

				var MOVE_IN_MARGIN = 2; // meters
				var MOVE_OUT_MARGIN = 2; // meters

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

						this._lat = parseFloat(attrs['lat'   ]);
						this._lng = parseFloat(attrs['lng'   ]);
						this._radius = parseInt(attrs['radius']);

						this._audioElement = element.children('audio')[0];

						this._playing = false;
						this._userIsInside = false;


						/////////////////////////////
						////// Private methods //////
						//////                 //////

						//// Audio Controls
						//
						this._playAudio = function _playAudio() { this._audioElement.play(); };

						this._pauseAudio = function _pauseAudio() { this._audioElement.pause(); };

						this._stopAudio = function _stopAudio() {
							this._audioElement.pause();
							this._audioElement.currentTime = 0;
						};

						this._startPlayback = function _startPlayback() {
							if (!this._playing) {
								this._playing = true;
								this._playAudio();
								this._mapCircle.start();
							}
						};

						this._pausePlayback = function _pausePlayback() {
							if (this._playing) {
								this._playing = false;
								this._pauseAudio();
								this._mapCircle.stop();
							}
						};

						this._stopPlayback = function _stopPlayback() {
							if (this._playing) {
								this._playing = false;
								this._stopAudio();
								this._mapCircle.stop();
							}
						};

						this._togglePlayback = function _togglePlayback() {
							if (this._playing) { this._pausePlayback(); }
							else { this._startPlayback(); }
						};

						this._adaptToNewPosition = function _adaptToNewPosition(position) {
							var currentPosition = new google.maps.LatLng(this._lat, this._lng);
							var newPosition = position.latLng;

							var distance = google.maps.geometry.spherical
									.computeDistanceBetween(currentPosition, newPosition);

							if (!this._userIsInside && distance < this._radius - MOVE_IN_MARGIN) {
								this._userIsInside = true;
								this._startPlayback();
							} else if (this._userIsInside &&
									distance > this._radius + position.coords.accuracy + MOVE_OUT_MARGIN) {
								this._userIsInside = false;
								this._stopPlayback();
							}
						};


						/////////////////////////
						////// Constructor //////
						//////             //////

						$(this._audioElement).one('playing', this._pauseAudio);

						//// Implement the animation for the wave circles.
						//
						this._mapCircle = new MapCircle(controller.map(), this._lat, this._lng, this._radius);

						//// Ways to stop and start playback
						//
						$(this._audioElement).on('ended', this._stopPlayback);
						this._mapCircle.onClick(this._togglePlayback);

						//// Callback for user position change
						//
						controller.onNewUserPosition(this._adaptToNewPosition);

					}
				};
			});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
