'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['gmaps', 'angular', 'ts-map', 'SoundSource', 'AudioPlayer', 'TS', 'geo'], function (gmaps, angular, tsMap, SoundSource, AudioPlayer) {
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
	angular.module('TS').directive('tsArea', ['geo', function (geo) { //////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		return { ///////////////////////////////////////////////////////////////////////////////////////////////////////
//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			restrict   : 'E',
			templateUrl: 'partials/tsArea/tsArea.html',
			replace    : true,
			scope      : {},
			transclude : true,
			require    : '^tsMap',

			link: function (scope, element, attrs, controller) {


				//////////////////////////
				////// Audio Player //////
				//////              //////


				var audioPlayer = new AudioPlayer(element.children('audio')[0]);


				///////////////////////////
				////// Source Marker //////
				//////               //////


				var sourceMarker = new SoundSource(
						controller.map(),
						parseFloat(attrs['lat']),
						parseFloat(attrs['lng']),
						parseFloat(attrs['radius']),
						parseFloat(attrs['reach']),
						attrs['path'],
						parseFloat(attrs['velocity']),
						attrs['invisible']);


				////////////////////////////////////////////////
				////// Processing Proximity with the User //////
				//////                                    //////


				var loudness = parseFloat(attrs['loudness']);

				function processInteractionWithUserPos() {

					//// Calculate the distance between the two centers
					//
					var distance = gmaps.geometry.spherical.computeDistanceBetween(
							sourceMarker.pos(),
							geo.lastKnownPosition().toLatLng()
					);


					//// Tell the source marker whether the user is within reach
					//
					sourceMarker.setUserWithinReach(distance <= sourceMarker.reach());


					//// Set the audio volume
					//
					var volume = loudness;

					if (sourceMarker.reach() < distance) {
						volume *= 0;
					} else if (distance < sourceMarker.radius()) {
						volume *= 1;
					} else { // (sourceMarker.radius() ≤ distance ≤ sourceMarker.reach())
						volume *= 1 - quadraticProgression(
								sourceMarker.radius(),
								sourceMarker.reach(),
								distance);
					}

					audioPlayer.setVolume(volume);
				}


				////////////////////////////////////////
				////// Continuously Adjust Volume //////
				//////                            //////


				processInteractionWithUserPos();

				geo.watchPosition(processInteractionWithUserPos);

				sourceMarker.onNewPos(processInteractionWithUserPos);


				///////////////////////
				////// Interface //////
				//////           //////


				var result = {};


				result.pos = sourceMarker.pos;

				var _running = false;

				result.running = function () {
					return _running;
				};

				result.run = function () {
					if (!_running) {
						_running = true;
						audioPlayer.loop();
						sourceMarker.start();
						window.setTimeout(processInteractionWithUserPos, 10);
						_onRunCallback.fire();
					}
				};

				result.pause = function () {
					if (_running) {
						_running = false;
						audioPlayer.pause();
						sourceMarker.stop();
						_onPauseCallback.fire();
					}
				};

				result.toggle = function () {
					if (_running) {
						result.pause();
					} else {
						result.run();
					}
				};

				var _onRunCallback = $.Callbacks('unique');
				var _onPauseCallback = $.Callbacks('unique');

				result.onRun = function (handler) {
					_onRunCallback.add(handler);
				};

				result.onPause = function (handler) {
					_onPauseCallback.add(handler);
				};

				if (attrs['scenario'] !== undefined) {
					controller.registerScenario(attrs['scenario']);
				}
				controller.registerSource(result, attrs['scenario']);


				//////////////////////////////////////
				////// Click to Toggle Playback //////
				//////                          //////


				sourceMarker.onClick(function () {
					scope.$apply(result.toggle());
				});

			}


//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		};//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	}]);/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
