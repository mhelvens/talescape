////////////////////////////////////////////////////////////////////////////////
define  (['gmaps'], function () {
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

	

  ///////////////////////
 ////// Constants //////
//////           //////

var ANI_FIRST_STATE       = 27; // frames
var ANI_HALT_STATE        = 23; // frames
var ANI_END_STATE         = 30; // frames
var ANI_SECOND_WAVE_DELAY = 5;  // frames
var ANI_TIMER_PERIOD      = 40; // milliseconds
var ANI_CIRCLE_MAX_WIDTH  = 4;  // meters
var ANI_WAVE_SPEED        = 7;  // factor



////////////////////////////////////////////////////////////////////////////////
return function (map, lat, lng, radius) { //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
	
	
	  ///////////////////////////////
	 ////// Private variables //////
	//////                   //////
	
	var _timer;
	var _mainCircle;
	var _circle1;
	var _circle2;
	var _state;
	var _playing = false;
	var _currentZoom = map.getZoom();
	
	

	  /////////////////////////////
	 ////// Private methods //////
	//////                 //////
	
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
		_incrementAnimationState();
		
		var state = _animationState(0);
		_circle1.setOptions({
			radius:       radius + _zoomScale() * state * ANI_WAVE_SPEED,
			strokeWeight: (ANI_CIRCLE_MAX_WIDTH - state * ANI_CIRCLE_MAX_WIDTH / ANI_HALT_STATE),
			visible:      (state < ANI_HALT_STATE)
		});
		
		state = _animationState(ANI_SECOND_WAVE_DELAY);
		_circle2.setOptions({
			radius:       radius + _zoomScale() * state * ANI_WAVE_SPEED,
			strokeWeight: (ANI_CIRCLE_MAX_WIDTH - state * ANI_CIRCLE_MAX_WIDTH / ANI_HALT_STATE),
			visible:      (state < ANI_HALT_STATE)
		});
	}
	
	

	  /////////////////////////
	 ////// Constructor //////
	//////             //////
	
	
	 //// Instantiate circles
	//
	(function(){
		var commonCircleOptions = {
			map: map,
			center: new google.maps.LatLng(lat, lng),
			radius: radius,
			draggable: false,
			editable: false
		};
		var mainCircleOptions = $.extend({}, commonCircleOptions, {
			clickable: true,
			fillColor: 'green',
			fillOpacity: 0.4,
			strokeColor: 'green',
			strokeOpacity: 0.9,
			strokePosition: google.maps.INSIDE,
			strokeWeight: 4,
			zIndex: 1,
			visible: true
		});
		var aniCircleOptions = $.extend({}, commonCircleOptions, {
			clickable: false,
			fillOpacity: 0,
			strokeColor: 'red',
			strokeOpacity: 1,
			strokeWeight: 4,
			strokePosition: google.maps.OUTSIDE,
			zIndex: 2,
			visible: false
		});

		_mainCircle  = new google.maps.Circle(mainCircleOptions);
		_circle1 = new google.maps.Circle(aniCircleOptions );
		_circle2 = new google.maps.Circle(aniCircleOptions );
	})();
	
	 //// Listen for zoom-level change
	//
	google.maps.event.addListener(map, 'zoom_changed', function() {
		_currentZoom = map.getZoom();
	});
	
	
	
	  ////////////////////////////
	 ////// Public methods //////
	//////                //////
	
	this.playing = function() {
		return _playing;
	}
	
	this.start = function() {
		if (!_playing) {
			_playing = true;
			_state = ANI_FIRST_STATE - 1;
			_takeAnimationStep();
			_timer = setInterval(_takeAnimationStep, ANI_TIMER_PERIOD);
			_mainCircle.setOptions({ fillColor: 'red', strokeColor: 'red' });
		}
	}
	
	this.stop = function() {
		if (_playing) {
			_playing = false;
			_mainCircle.setOptions({ fillColor: 'green', strokeColor: 'green' });
			clearInterval(_timer);
			_circle1.setOptions({ visible: false });
			_circle2.setOptions({ visible: false });
		}
	}
	
	this.toggle = function() {
		if (_playing) { this.stop();  }
		else          { this.start(); }
	}
	
	this.onClick = function(handler) {
		google.maps.event.addListener(_mainCircle, 'click', handler);
	}
	
};


////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
