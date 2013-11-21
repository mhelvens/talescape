////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['gmaps'], function () { ////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	///////////////////////
	////// Constants //////
	//////           //////

	var ANIMATE = true;

	var ANI_FIRST_STATE = 27; // frames
	var ANI_HALT_STATE = 23; // frames
	var ANI_END_STATE = 30; // frames
	var ANI_SECOND_WAVE_DELAY = 5;  // frames
	var ANI_TIMER_PERIOD = 40; // milliseconds
	var ANI_CIRCLE_MAX_WIDTH = 4;  // meters
	var ANI_WAVE_SPEED = 7;  // factor

	var PATH_STEP_LENGTH = 1/*m*/;
	var PATH_STEP_TIME = 50/*ms*/;

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
					_state = ANI_FIRST_STATE - 1;
					_takeAnimationStep();
					_timer = setInterval(_takeAnimationStep, ANI_TIMER_PERIOD);
				}
				_mainCircle.setOptions({ fillColor: 'red', strokeColor: 'red' });
			}
		};

		this.stop = function () {
			if (_playing) {
				_playing = false;
				_mainCircle.setOptions({ fillColor: 'green', strokeColor: 'green' });
				if (ANIMATE) {
					clearInterval(_timer);
					_aniCircle1.setOptions({ visible: false });
					_aniCircle2.setOptions({ visible: false });
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
		var _reachCircle;

		var _timer;
		var _state;
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

			_mainCircle = new google.maps.Circle(mainCircleOptions);
			_reachCircle = new google.maps.Circle(reachCircleOptions);

			if (ANIMATE) {
				_aniCircle1 = new google.maps.Circle(aniCircleOptions);
				_aniCircle2 = new google.maps.Circle(aniCircleOptions);
			}
		})();


        if (!_encodedPath) {
            _staticPos = new google.maps.LatLng(_lat, _lng);
        } else {
            var _path = google.maps.geometry.encoding.decodePath(_encodedPath);

            //// Set up the Path Steps
            //
            var _pathSteps = [];
            (function () {
                var remainder = 0;
                for (var segment = 1; segment < _path.length; ++segment) {
                    var from = _path[segment - 1];
                    var to = _path[segment];

                    var distance = google.maps.geometry.spherical.computeDistanceBetween(from, to);
                    var heading = google.maps.geometry.spherical.computeHeading(from, to);

                    for (var i = 0; remainder + i * PATH_STEP_LENGTH < distance; ++i) {
                        _pathSteps.push(google.maps.geometry.spherical.computeOffset(
                            from,
                            remainder + i * PATH_STEP_LENGTH,
                            heading));
                    }

                    remainder = remainder + i * PATH_STEP_LENGTH - distance;
                }
            })();

            //// Set up Movement along Path
            //
            var _currentPathStep = 0;
//            var _startTime = Date.now();
            window.setInterval(function () {
                //_currentPathStep = (Date.now() - _startTime) % PATH_STEP_TIME;
                _currentPathStep = (_currentPathStep + 1) % _pathSteps.length;
                _mainCircle.setCenter(_pos());
                _reachCircle.setCenter(_pos());
                _newPosCallbacks.fire(_pos());
            }, PATH_STEP_TIME);
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
            return _encodedPath ? _pathSteps[_currentPathStep] : _staticPos;
        }

		function _animationState(delay) {
			return (_state + delay) % ANI_END_STATE;
		}

		function _incrementAnimationState() {
			_state = _animationState(1);
		}

		function _zoomScale() {
			return Math.pow(2, 15 - _currentZoom);
		}

		function _takeAnimationStep() {
			if (ANIMATE) {
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
