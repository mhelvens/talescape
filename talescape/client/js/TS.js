////////////////////////////////////////////////////////////////////////////////
define  (['jquery', 'angular', 'gmaps'],
function ( $      ,  angular ) {
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


 //// Angular Talescape Main Module
//
var TS = angular.module("TS", [])


////////////////////////////////////////////////////////////
// ApplicationController ///////////////////////////////////
////////////////////////////////////////////////////////////

.controller('ApplicationController', ['$scope',
      	                    function ( $scope ) {
	$scope.title = 'Talescape';
}])



////////////////////////////////////////////////////////////
// MapController ///////////////////////////////////////////
////////////////////////////////////////////////////////////

.controller('MapController', ['$scope', '$element', '$attrs',
                    function ( $scope ,  $element ,  $attrs ){
	
	  ///////////////////////////////
	 ////// Private variables //////
	//////                   //////

	var _map;
	var _options = {};
	
	var _locationMarker;
	var _locationMarkerAccuracyCircle;

	var _onNewZoomLevelCallbacks    = [];
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
		
		for (callback in _onNewUserPositionCallbacks) {
			_onNewUserPositionCallbacks[callback](position);
		}
	}
	
	function _placeLocationMarker(position) {
		if (!_locationMarker) {
			_locationMarker = new google.maps.Marker({
	            map:       _map,
	            title:     "You Are Here",
	            zIndex:    3,
				draggable: false,
				editable:  false,
				clickable: false,
				position:  position.latLng,
	            icon: {
	            	url:       'img/marker.png',
	    			size:       new google.maps.Size (96, 96),
	    			origin:     new google.maps.Point(0 , 0 ),
	    			anchor:     new google.maps.Point(16, 16),
	    			scaledSize: new google.maps.Size (32, 32)
	            }
	        });
		}
		
		if (!_locationMarkerAccuracyCircle) {
			_locationMarkerAccuracyCircle = new google.maps.Circle({
				map:          _map,
				strokeColor:  '#4190da',
				strokeOpacity: 0.8,
				strokeWeight:  2,
				fillColor:    '#4190da',
				fillOpacity:   0.35,
				draggable:     false,
				editable:      false,
				clickable:     false
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
		mapTypeId:        google.maps.MapTypeId.SATELLITE,              // default: satellite view
		disableDefaultUI: true,                                         // default: no controls
		zoom:             0,                                            // start zoom level
		center:           new google.maps.LatLng(52.3564841, 4.9520856) // start location
	}, $scope.$eval($attrs['options']));
	
	 //// Create the map
	//
	_map = new google.maps.Map($element.children(".canvas")[0], _options);
	
	 //// Listen to zoom-changes
	//
	google.maps.event.addListener(_map, 'zoom_changed', function() {
		for (i in _onNewZoomLevelCallbacks) {
			_onNewZoomLevelCallbacks[i](_map.getZoom());
		}
	});
	
	 //// Listen to user location
	//
	$.webshims.ready('geolocation', function(){
		navigator.geolocation.watchPosition(_onNewPosition);
	});
	
	

	  ////////////////////////////
	 ////// Public methods //////
	//////                //////
	
	this.onNewUserPosition = function(callback) {
		_onNewUserPositionCallbacks.push(callback);
	}
	
	this.onNewZoomLevel = function(callback) {
		_onNewZoomLevelCallbacks.push(callback);
	}
	
	this.map = function() {
		return _map;
	}
	
}])



////////////////////////////////////////////////////////////
// 'ts-map' Directive //////////////////////////////////////
////////////////////////////////////////////////////////////

.directive('tsMap', function(){ return {
	controller:  'MapController',
	restrict:    'E',
	templateUrl: 'partials/tsMap/tsMap.html',
	replace:      true,
	transclude:   true,
	scope:        {}
}})



////////////////////////////////////////////////////////////
// 'ts-area' Directive /////////////////////////////////////
////////////////////////////////////////////////////////////

.directive('tsArea', function(){ return {
	restrict:    'E',
	templateUrl: 'partials/tsArea/tsArea.html',
	replace:      true,
	scope:        {},
	require:     '^tsMap',
	
	link: function(scope, element, attrs, controller) {

		  ///////////////////////////////
		 ////// Private variables //////
		//////                   //////

		var _lat        = parseFloat(attrs['lat']);
		var _lng        = parseFloat(attrs['lng']);
		var _radius     = parseInt  (attrs['radius']);
		var _audioFile  =            attrs['audio'];
		
		var _audioElement = element.children('audio')[0];

		var _circle;
		
		
		
		  /////////////////////////////
		 ////// Private methods //////
		//////                 //////

		 //// Audio Controls
		//
		function loadAudioFile(url) { _audioElement.src = url;      }
		function playAudio()        { _audioElement.play();         }
		function pauseAudio()       { _audioElement.pause();        }
		function audioIsPlaying()   { return !_audioElement.paused; }
		function stopAudio() {
			_audioElement.pause();
			_audioElement.currentTime = 0;
		}
		
		
		
		  /////////////////////////
		 ////// Constructor //////
		//////             //////
		
		 //// Load the right audio file
		//
		loadAudioFile(_audioFile);
		
		 //// Set the main area circle
		//
		_circle = new google.maps.Circle({
			map: controller.map(),
			center: new google.maps.LatLng(_lat, _lng),
			radius: _radius,
			draggable: false,
			editable: false,
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
		
		
		 //// Clicking the circle
		//
		google.maps.event.addListener(_circle, 'click', function() {
			if (audioIsPlaying())
			     { scope.$emit('click.playing.ts-area'); }
			else { scope.$emit('click.paused.ts-area');  }
		});
		
		
		 //// Implement the animation for the wave circles.
		//
		var _animation = (function(){
			
			////////// Private Constants //////////

			var ANI_FIRST_STATE       = 27; // frames
			var ANI_HALT_STATE        = 23; // frames
			var ANI_END_STATE         = 30; // frames
			var ANI_SECOND_WAVE_DELAY = 5;  // frames
			var ANI_TIMER_PERIOD      = 50; // milliseconds
			var ANI_CIRCLE_MAX_WIDTH  = 4;  // meters
			var ANI_WAVE_SPEED        = 7;  // factor
			
			////////// Private Variables //////////
			
			var _ani_timer;
			var _ani_circle1;
			var _ani_circle2;
			var _ani_state;
			var _ani_currentZoom = controller.map().getZoom();

			////////// Private Methods //////////
			
			function _animationState(delay) {
				return (_ani_state + delay) % ANI_END_STATE;
			}
			
			function _incrementAnimationState() {
				_ani_state = _animationState(1);
			}
			
			function _zoomScale() {
				return Math.pow(2, 15 - _ani_currentZoom);
			}
			
			function _takeAnimationStep() {
				_incrementAnimationState();
				
				var state = _animationState(0);
				_ani_circle1.setOptions({
					radius:       _radius + _zoomScale() * state * ANI_WAVE_SPEED,
					strokeWeight: (ANI_CIRCLE_MAX_WIDTH - state * ANI_CIRCLE_MAX_WIDTH / ANI_HALT_STATE),
					visible:      (state < ANI_HALT_STATE)
				});
				
				state = _animationState(ANI_SECOND_WAVE_DELAY);
				_ani_circle2.setOptions({
					radius:       _radius + _zoomScale() * state * ANI_WAVE_SPEED,
					strokeWeight: (ANI_CIRCLE_MAX_WIDTH - state * ANI_CIRCLE_MAX_WIDTH / ANI_HALT_STATE),
					visible:      (state < ANI_HALT_STATE)
				});
			}
			
			////////// Constructor //////////
			
			(function(){
				var aniCircleOptions = {
					map: controller.map(),
					center: new google.maps.LatLng(_lat, _lng),
					radius: _radius,
					draggable: false,
					editable: false,
					clickable: false,
					fillOpacity: 0,
					strokeColor: 'red',
					strokeOpacity: 1,
					strokeWeight: 4,
					strokePosition: google.maps.OUTSIDE,
					zIndex: 2,
					visible: false
				};
				_ani_circle1 = new google.maps.Circle(aniCircleOptions);
				_ani_circle2 = new google.maps.Circle(aniCircleOptions);
			})();
			
			controller.onNewZoomLevel(function(newZoom) {
				_ani_currentZoom = newZoom;
			});
			
			////////// Public Methods //////////
			
			return {
				start: function() {
					_circle.setOptions({ fillColor: 'red', strokeColor: 'red' });
					_ani_circle1.setOptions({ visible: true });
					_ani_circle2.setOptions({ visible: true });
					_ani_state = ANI_FIRST_STATE;
					_ani_timer = setInterval(_takeAnimationStep, ANI_TIMER_PERIOD);
				},
				stop: function() {
					_circle.setOptions({ fillColor: 'green', strokeColor: 'green' });
					clearInterval(_ani_timer);
					_ani_circle1.setOptions({ visible: false });
					_ani_circle2.setOptions({ visible: false });
				}
			};
		})();
		
		
		function startPlayback() {
			playAudio();
			_animation.start();
		}
		function pausePlayback() {
			pauseAudio();
			_animation.stop();
		}
		function stopPlayback() {
			stopAudio();
			_animation.stop();
		}
		
		
		 //// Ways to stop and start playback
		//
		$(_audioElement).on('ended',  stopPlayback);
		scope.$on('click.playing.ts-area', pausePlayback);
		scope.$on('click.paused.ts-area',  startPlayback);
		
		
		 //// Callback for user position change
		//
		var userIsInside  = false;
		var moveInMargin  = 2;//meters
		var moveOutMargin = 2;//meters
		controller.onNewUserPosition(function(position) {
			var distance = google.maps.geometry.spherical.computeDistanceBetween
				(_circle.getCenter(), position.latLng);
			
			if (!userIsInside && distance < _circle.getRadius() - moveInMargin) {
				userIsInside = true;
				startPlayback();
			} else if (userIsInside && distance > _circle.getRadius() + position.coords.accuracy + moveOutMargin) {
				userIsInside = false;
				stopPlayback();
			}
		});
		
		
	}
}})



////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
