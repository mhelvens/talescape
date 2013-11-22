////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['gmaps'], function () { ////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	///////////////////////
	////// Constants //////
	//////           //////

	var ANIMATE = true;
	var REACH_CIRCLE = false;

	var ANI_FIRST_STATE = 27; // frames
	var ANI_HALT_STATE = 23; // frames
	var ANI_END_STATE = 30; // frames
	var ANI_SECOND_WAVE_DELAY = 5;  // frames
	var ANI_TIMER_PERIOD = 40; // milliseconds
	var ANI_CIRCLE_MAX_WIDTH = 4;  // meters
	var ANI_WAVE_SPEED = 7;  // factor

	var PATH_SPEED = 10/* m/s */;
	var PATH_STEP_TIME = 50/* ms */;

//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	return function (_map, _lat, _lng, _radius, _reach, _encodedPath) { ////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		// TODO: Make sure (_radius < _reach)


		////////////////////////////
		////// Public methods //////
		//////                //////


		//// Querying ////
		//
		this.pos = function () { return _pos(); };

		this.lat = function () { return this.pos().lat(); };

		this.lng = function () { return this.pos().lng(); };

		this.radius = function () { return _radius; };

		this.reach = function () { return _reach; };

		this.path = function () { return _path; };


		//// Basic Controls ////
		//
		this.playing = function () {
			return _playing;
		};

		this.start = function () {
			if (!_playing) {
				_playing = true;
				if (ANIMATE) {
					_aniState = ANI_FIRST_STATE;
					_aniTimer = window.setInterval(_takeAnimationStep, ANI_TIMER_PERIOD);
				}
				if (_encodedPath) {
					_pathTimer = window.setInterval(_takePathStep, PATH_STEP_TIME);
				}
				_mainCircle.setOptions({ fillColor: 'red', strokeColor: 'red' });
			}
		};

		this.stop = function () {
			if (_playing) {
				_playing = false;
				_mainCircle.setOptions({ fillColor: 'green', strokeColor: 'green' });
				if (ANIMATE) {
					window.clearInterval(_aniTimer);
					_aniCircle1.setOptions({ visible: false });
					_aniCircle2.setOptions({ visible: false });
				}
				if (_encodedPath) {
					window.clearInterval(_pathTimer);
				}
			}
		};

		this.toggle = function () {
			if (_playing) { this.stop(); } else { this.start(); }
		};


		//// Events ////
		//
		this.onClick = function (handler) {
			google.maps.event.addListener(_mainCircle, 'click', handler);
		};

		var _newPosCallbacks = $.Callbacks('unique');
		this.onNewPos = function (handler) {
			_newPosCallbacks.add(handler);
		};


		///////////////////////////////
		////// Private variables //////
		//////                   //////


		var _staticPos;

		var _mainCircle;
		var _aniCircle1;
		var _aniCircle2;
		if (REACH_CIRCLE) { var _reachCircle; }

		var _pathTimer;

		var _aniTimer;
		var _aniState;
		var _playing = false;
		var _currentZoom = _map.getZoom();


		/////////////////////////
		////// Constructor //////
		//////             //////


		//// Instantiate circles
		//
		(function () {
			var commonCircleOptions = {
				map      : _map,
				center   : new google.maps.LatLng(_lat, _lng),
				radius   : _radius,
				draggable: false,
				editable : false
			};

			var mainCircleOptions = $.extend({}, commonCircleOptions, {
				clickable     : true,
				fillColor     : 'green',
				fillOpacity   : 0.4,
				strokeColor   : 'green',
				strokeOpacity : 0.9,
				strokePosition: google.maps.INSIDE,
				strokeWeight  : 4,
				zIndex        : 1,
				visible       : true
			});

			_mainCircle = new google.maps.Circle(mainCircleOptions);

			if (ANIMATE) {
				var aniCircleOptions = $.extend({}, commonCircleOptions, {
					clickable     : false,
					fillOpacity   : 0,
					strokeColor   : 'red',
					strokeOpacity : 1,
					strokeWeight  : 4,
					strokePosition: google.maps.OUTSIDE,
					zIndex        : 2,
					visible       : false
				});

				_aniCircle1 = new google.maps.Circle(aniCircleOptions);
				_aniCircle2 = new google.maps.Circle(aniCircleOptions);
			}

			if (REACH_CIRCLE) {
				var reachCircleOptions = $.extend({}, commonCircleOptions, {
					clickable    : false,
					fillOpacity  : 0,
					strokeColor  : 'yellow',
					strokeOpacity: 1,
					strokeWeight : 1,
					zIndex       : 3,
					visible      : true,
					radius       : _reach
				});

				_reachCircle = new google.maps.Circle(reachCircleOptions);
			}

		})();


		if (!_encodedPath) {
			_staticPos = new google.maps.LatLng(_lat, _lng);
		} else {
			var _path = google.maps.geometry.encoding.decodePath(_encodedPath);
			var _segments = [];

			//// Precompute the distance and heading of each path segment
			//
			for (var segment = 0; segment < _path.length; ++segment) {
				var from = _path[segment];
				var to = _path[(segment + 1) % _path.length];

				_segments[segment] = {
					distance: google.maps.geometry.spherical.computeDistanceBetween(from, to),
					heading : google.maps.geometry.spherical.computeHeading(from, to)
				};
			}

			//// Set up movement along the path
			//
			var _lastTime = Date.now();
			var _segment = 0;
			var _segmentProgress = 0;
			var _dynamicPos = _path[_segment];

			var _takePathStep = function () {
				var thisTime = Date.now();
				var distanceToGo = (thisTime - _lastTime) / 1000 * PATH_SPEED;
				while (distanceToGo > 0) {
					if (_segmentProgress + distanceToGo > _segments[_segment].distance) {
						distanceToGo -= (_segments[_segment].distance - _segmentProgress);
						_segmentProgress = 0;
						_segment = (_segment + 1) % _path.length;
					} else {
						_segmentProgress += distanceToGo;
						_dynamicPos = google.maps.geometry.spherical.computeOffset(
								_path[_segment], _segmentProgress, _segments[_segment].heading);
						distanceToGo = 0;
					}
				}
				//noinspection ReuseOfLocalVariableJS
				_lastTime = thisTime;

				_mainCircle.setCenter(_pos());
				if (REACH_CIRCLE) { _reachCircle.setCenter(_pos()); }

				_newPosCallbacks.fire(_pos());
			};
		}

		//// Listen for zoom-level change
		//
		if (ANIMATE) {
			google.maps.event.addListener(_map, 'zoom_changed', function () {
				//noinspection ReuseOfLocalVariableJS
				_currentZoom = _map.getZoom();
			});
		}


		/////////////////////////////
		////// Private methods //////
		//////                 //////


		function _pos() {
//			return _encodedPath ? _pathSteps[_currentPathStep] : _staticPos;
			return _encodedPath ? _dynamicPos : _staticPos;
		}

		function _animationState(delay) {
			return (_aniState + delay) % ANI_END_STATE;
		}

		function _incrementAnimationState() {
			_aniState = _animationState(1);
		}

		function _zoomScale() {
			return Math.pow(2, 15 - _currentZoom);
		}

		if (ANIMATE) {
			function _takeAnimationStep() {
				_incrementAnimationState();

				var state1 = _animationState(0);
				if (state1 == ANI_FIRST_STATE) {
					_aniCircle1.setOptions({
						center: _pos()
					});
				}
				_aniCircle1.setOptions({
					radius      : _radius + _zoomScale() * state1 * ANI_WAVE_SPEED,
					strokeWeight: (ANI_CIRCLE_MAX_WIDTH - state1 * ANI_CIRCLE_MAX_WIDTH / ANI_HALT_STATE),
					visible     : (state1 < ANI_HALT_STATE)
				});

				var state2 = _animationState(ANI_SECOND_WAVE_DELAY);
				if (state2 == ANI_FIRST_STATE) {
					_aniCircle2.setOptions({
						center: _pos()
					});
				}
				_aniCircle2.setOptions({
					radius      : _radius + _zoomScale() * state2 * ANI_WAVE_SPEED,
					strokeWeight: (ANI_CIRCLE_MAX_WIDTH - state2 * ANI_CIRCLE_MAX_WIDTH / ANI_HALT_STATE),
					visible     : (state2 < ANI_HALT_STATE)
				});
			}
		}


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	};//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
