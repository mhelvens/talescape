////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'gmaps'], function ($, gmaps) { //////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	///////////////////////
	////// Constants //////
	//////           //////


	var PATH_STEP_TIME = 50/* ms */;


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	return function (_map, _lat, _lng, _radius, _reach, _encodedPath, _velocity, _invisible) { /////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


		if (!(0 <= _radius && _radius <= _reach)) {
			throw new RangeError("Property (0 ≤ radius ≤ reach) is not satisfied.");
		}


		///////////////////////////////
		////// Private variables //////
		//////                   //////


		var _staticPos;
		var _pathTimer;

		var _mainCircle;
		var _reachCircle;

		var _playing = false;


		//////////////////////
		////// Position //////
		//////          //////


		function _pos() {
			return _encodedPath ? _dynamicPos : _staticPos;
		}


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
				if (_encodedPath) {
					_pathTimer = window.setInterval(_takePathStep, PATH_STEP_TIME);
				}
				_mainCircle.setOptions({ fillColor: 'red', strokeColor: 'red' });
				_reachCircle.setVisible(!_invisible);
			}
		};

		this.stop = function () {
			if (_playing) {
				_playing = false;
				_mainCircle.setOptions({ fillColor: 'green', strokeColor: 'green' });
				if (_encodedPath) {
					window.clearInterval(_pathTimer);
				}
				_reachCircle.setVisible(false);
			}
		};

		this.toggle = function () {
			if (_playing) { this.stop(); } else { this.start(); }
		};


		//// Events ////
		//
		this.onClick = function (handler) {
			gmaps.event.addListener(_mainCircle, 'click', handler);
		};

		var _newPosCallbacks = $.Callbacks('unique');
		this.onNewPos = function (handler) {
			_newPosCallbacks.add(handler);
		};


		/////////////////////////
		////// Constructor //////
		//////             //////


		if (!_encodedPath) {
			_staticPos = new gmaps.LatLng(_lat, _lng);
		} else {

			var _path = gmaps.geometry.encoding.decodePath(_encodedPath);
			var _segments = [];

			//// Precompute the distance and heading of each path segment
			//
			for (var segment = 0; segment < _path.length - 1; ++segment) {
				var from = _path[segment];
				var to = _path[segment + 1]; // no wrap around; cycle paths have start and end point equal

				_segments[segment] = {
					distance: gmaps.geometry.spherical.computeDistanceBetween(from, to),
					heading : gmaps.geometry.spherical.computeHeading(from, to)
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
				var distanceToGo = (thisTime - _lastTime) / 1000 * (_velocity || 10);
				while (distanceToGo > 0) {
					if (_segmentProgress + distanceToGo > _segments[_segment].distance) {
						distanceToGo -= (_segments[_segment].distance - _segmentProgress);
						_segmentProgress = 0;
						_segment = (_segment + 1) % _segments.length;
					} else {
						_segmentProgress += distanceToGo;
						_dynamicPos = gmaps.geometry.spherical.computeOffset(
								_path[_segment], _segmentProgress, _segments[_segment].heading);
						distanceToGo = 0;
					}
				}
				//noinspection ReuseOfLocalVariableJS
				_lastTime = thisTime;

				_mainCircle.setCenter(_pos());
				_reachCircle.setCenter(_pos());

				_newPosCallbacks.fire(_pos());
			};
		}


		//// Instantiate circles
		//
		(function () {
			var commonCircleOptions = {
				map      : _map,
				center   : _pos(),
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
				strokePosition: gmaps.INSIDE,
				strokeWeight  : 4,
				zIndex        : 1,
				visible       : !_invisible
			});

			_mainCircle = new gmaps.Circle(mainCircleOptions);

			var reachCircleOptions = $.extend({}, commonCircleOptions, {
				clickable    : false,
				fillOpacity  : 0,
				fillColor    : 'red',
				strokeColor  : 'red',
				strokeOpacity: .3,
				strokeWeight : 1,
				zIndex       : 3,
				visible      : false,
				radius       : _reach
			});

			_reachCircle = new gmaps.Circle(reachCircleOptions);

		})();


		////////////////////////////////////
		////// React to User Position //////
		//////                        //////


		this.setUserWithinReach = function (val) {
			if (val) {
				_reachCircle.setOptions({ fillOpacity: .1, strokeWeight: 2, strokeOpacity:.9 });
			} else {
				_reachCircle.setOptions({ fillOpacity: 0, strokeWeight: 1, strokeOpacity:.3 });
			}
		};


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	};//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
