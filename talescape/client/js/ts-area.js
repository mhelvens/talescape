'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['gmaps', 'angular', 'ts-map', 'SoundSource', 'AudioPlayer', 'TS'],
		function (gmaps, angular, tsMap, SoundSource, AudioPlayer) {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


			///////////////////////////////
			////// Utility Functions //////
			//////                   //////


//	function _linearProgression(close, far, here) {
//		return (here - close) / (far - close);
//	}


			function quadraticProgression(close, far, here) {
				return ( (here - close) * (here - close) ) /
				       ( (far - close) * (far - close) );
			}


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			angular.module('TS').directive('tsArea', function () {
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

				return {
					restrict   : 'E',
					templateUrl: 'partials/tsArea/tsArea.html',
					replace    : true,
					scope      : {audio: '@'},
					require    : '^tsMap',

					link: function (scope, element, attrs, controller) {


						///////////////////////////
						////// Source Marker //////
						//////               //////


						var sourceMarker = new SoundSource(
								controller.map(),
								parseFloat(attrs['lat']),
								parseFloat(attrs['lng']),
								parseFloat(attrs['radius']),
								parseFloat(attrs['reach']),
								attrs['path']);


						//////////////////////////
						////// Audio Player //////
						//////              //////


						var audioPlayer = new AudioPlayer(element.children('audio')[0]);


						////////////////////////////////
						////// Calculating Volume //////
						//////                    //////


						var loudness = parseFloat(attrs['loudness']);

						function adjustVolume() {
							var volume = 0;

							if (controller.userPos() && controller.userPos().latLng) {
								var distance = gmaps.geometry.spherical.computeDistanceBetween(
										sourceMarker.pos(),
										controller.userPos().latLng
								);

								if (sourceMarker.reach() < distance) {
									volume = 0;
								}
								else if (distance < sourceMarker.radius()) {
									volume = 1;
								}
								else { // inbetween
									volume = 1 - quadraticProgression(
											sourceMarker.radius(),
											sourceMarker.reach(),
											distance);
								}
							}

							volume *= loudness;

							audioPlayer.setVolume(volume);
						}


						////////////////////////////////////////
						////// Continuously Adjust Volume //////
						//////                            //////


						adjustVolume();

						controller.onNewUserPos(adjustVolume);

						sourceMarker.onNewPos(adjustVolume);


						///////////////////////
						////// Interface //////
						//////           //////


						var object = {};


						var _running = false;

						object.running = function () {
							return _running;
						};

						object.run = function () {
							if (!_running) {
								_running = true;
								audioPlayer.loop();
								sourceMarker.start();
								window.setTimeout(adjustVolume, 10);
								_onRunCallback.fire();
							}
						};

						object.pause = function () {
							if (_running) {
								_running = false;
								audioPlayer.pause();
								sourceMarker.stop();
								_onPauseCallback.fire();
							}
						};

						object.toggle = function () {
							if (_running) { object.pause(); }
							else { object.run(); }
						};

						var _onRunCallback = $.Callbacks('unique');
						var _onPauseCallback = $.Callbacks('unique');

						object.onRun = function (handler) {
							_onRunCallback.add(handler);
						};

						object.onPause = function (handler) {
							_onPauseCallback.add(handler);
						};

						controller.registerSource(object);


						//////////////////////////////////////
						////// Click to Toggle Playback //////
						//////                          //////


						sourceMarker.onClick(function () { scope.$apply(object.toggle()); });

					}
				};

//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			});
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
