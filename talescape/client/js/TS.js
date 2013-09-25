////////////////////////////////////////////////////////////////////////////////
define  (['jquery', 'angular', 'ng-ui/map'],
function ( $      ,  angular ) {
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


 //// Angular Talescape Main Module
//
var TS = angular.module('TS', ['ui.map']);


 //// Main Application Controller
//
TS.controller('ApplicationController', ['$scope',
      	                      function ( $scope ) {
	$scope.title = 'Talescape';
}]);



 //// Google Map Controller
//
TS.controller('MapController', ['$scope', '$controller',
                      function ( $scope ,  $controller) {
	
//	 //// For creating and storing new map areas
//	//
//	$scope.mapAreas = new Array();
//	function spawnMapArea(options) {
//		$scope.mapAreas.push($controller(
//			'MapAreaController',
//			{$scope: $.extend({}, $scope.$new(), options)}
//		));
//	}

	 //// The icon used for the user location
	//
	function locationMarkerIcon(radius) {
		return {
        	url:       'img/marker.png',
			size:       new google.maps.Size (96, 96),
			origin:     new google.maps.Point(0, 0),
			anchor:     new google.maps.Point(radius, radius),
			scaledSize: new google.maps.Size (2*radius, 2*radius)
        };
	}
	
	 //// For placing the user location marker on the map
	//
	var locationMarker;
	var locationMarkerAccuracyCircle;
	function placeLocationMarker(position) {
		if (!locationMarker) {
			locationMarker = new google.maps.Marker({
	            map: $scope.map,
	            title: "You Are Here",
	            icon: locationMarkerIcon(16),
	            zIndex: 3,
				draggable: false,
				editable:  false,
				clickable: false
	        });
		}
		
		locationMarker.setPosition(position.latLng);
		
		if (!locationMarkerAccuracyCircle) {
			locationMarkerAccuracyCircle = new google.maps.Circle({
				map: $scope.map,
				strokeColor: '#4190da',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#4190da',
				fillOpacity: 0.35,
				draggable: false,
				editable:  false,
				clickable: false
			});
		}
		
		locationMarkerAccuracyCircle.setCenter(position.latLng);
		locationMarkerAccuracyCircle.setRadius(position.coords.accuracy);
	}
	
	
	 //// Called when a new user position is detected
	//
	function updateGeoPosition(position) {
		
		console.log(
			"GeoLocation registered:\n" +
			"- lat: " + position.coords.latitude + "\n" +
			"- lng: " + position.coords.longitude
		);
		
		position.latLng = new google.maps.LatLng(
			position.coords.latitude,
			position.coords.longitude
		);
		
		placeLocationMarker(position);
		
		$scope.map.setCenter(position.latLng);
		
//		for (i in $scope.mapAreas) {
//			$scope.mapAreas[i].onNewUserPosition(position);
//		}
		
	}
	
	 //// Actually start doing things when we can get locations
	//
	$.webshims.ready('geolocation', function(){
		
//		 //// Spawn three test areas
//		//
//		navigator.geolocation.getCurrentPosition(function(pos){
//			
//		}, function(error){
//			console.error(error.message)
//		}, {
//			enableHighAccuracy: true
//		});
		
		 //// Start watching for the user's location
		//
		navigator.geolocation.watchPosition(updateGeoPosition);
		
	});
	
}]);



 ////'ts-map' HTML element
//
TS.directive('tsMap', function(){ return {
	controller:  'MapController',
	restrict:    'E',
	templateUrl: 'partials/tsMap/tsMap.html',
	replace:      true,
	transclude:   true,
	scope:       {attrOptions: '&options'},
	
	link: function(scope, element, attrs, controller) {
		$.extend(scope.options, {
			mapTypeId: google.maps.MapTypeId.SATELLITE,
			disableDefaultUI: true,
			center: new google.maps.LatLng(52.3564841, 4.9520856) // start location
		}, scope.attrOptions());
		
		scope.map = new google.maps.Map(element.children(".canvas")[0], scope.options);
		
		scope.$watch('options', function(newValue, oldValue) {
			scope.map.setOptions(newValue);
		});
		
//		google.maps.event.addListener(scope.map, 'zoom_changed', function() {
//			scope.zoom = scope.getZoom();
//			// TODO: fire event for the areas to subscribe to
//		});
	}
}});



 //// Google Map Area Controller
//
TS.controller('MapAreaController', ['$scope',
                          function ( $scope ) {

	 //// The object that will be returned
	//
	var Interface = {};
	
	//// Circles
	//
	var circle;
	var funkyCircle1;
	var funkyCircle2;
	
	   //// Create an area-specific HTML <audio> element,
	  ////  add some functions to control the audio and bind
	 ////   some relevant events.
	//
	var loadAudioFile  = function(url) { $scope.audioElement.src = url;      }
	var playAudio      = function()    { $scope.audioElement.play();         }
	var pauseAudio     = function()    { $scope.audioElement.pause();        }
	var audioIsPlaying = function()    { return !$scope.audioElement.paused; }
	var stopAudio      = function() {
		$scope.audioElement.pause();
		$scope.audioElement.currentTime = 0;
	}
	
	
	Interface.init = function() {
		
		loadAudioFile($scope.audio);
		
		var circleCommonOptions = {
			center: new google.maps.LatLng($scope.lat, $scope.lng),
			radius: $scope.radius,
			draggable: false,
			editable: false,
			map: $scope.map
		};
		var mainCircleOptions = $.extend({}, circleCommonOptions, {
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
		var funkyCircleOptions = $.extend({}, circleCommonOptions, {
			clickable: false,
			fillOpacity: 0,
			strokeColor: 'red',
			strokeOpacity: 1,
			strokeWeight: 4,
			strokePosition: google.maps.OUTSIDE,
			zIndex: 2,
			visible: false
		});

		circle       = new google.maps.Circle(mainCircleOptions );
		funkyCircle1 = new google.maps.Circle(funkyCircleOptions);
		funkyCircle2 = new google.maps.Circle(funkyCircleOptions);
		
		google.maps.event.addListener(circle, 'click', function() {
			if (Interface.audioIsPlaying())
			     { $scope.$emit('click.playing.ts-area'); }
			else { $scope.$emit('click.paused.ts-area');  }
		});
		
	}
	
	 //// Implement the animation for the wave circles.
	//
	var aniTimer;
	var aniTimerPeriod     = 50;
	var aniEndState        = 20;
	var aniMaxSteps        = 30;
	var startAniState      = 25;
	var aniState           = startAniState;
	var aniSecondWaveDelay = 5;
	function animationState(delay) { return (aniState + delay) % aniMaxSteps; }
	function incrementAnimationState() { aniState = animationState(1); }
	function zoomScale() { return Math.pow(2, 15 - $scope.zoom) }
	function expandCircle() {
		incrementAnimationState();
		var state = animationState(0);
		funkyCircle1.setOptions({
			radius:       $scope.radius + zoomScale() * state * 10,
			strokeWeight: (3 - state * 3 / aniEndState),
			visible:      (state < aniEndState)
		});
		state = animationState(aniSecondWaveDelay);
		funkyCircle2.setOptions({
			radius:       $scope.radius + zoomScale() * state * 10,
			strokeWeight: (3 - state * 3 / aniEndState),
			visible:      (state < aniEndState)
		});
	}
	
	
	 //// Function for starting playback of the circle: audio and animation
	//
	Interface.startPlayback = function() {
		if (!Interface.audioIsPlaying()) Interface.playAudio();
		circle.setOptions({ fillColor: 'red', strokeColor: 'red' });
		funkyCircle1.setOptions({ visible: true });
		funkyCircle2.setOptions({ visible: true });
		aniTimer = setInterval(expandCircle, aniTimerPeriod);
		aniState = startAniState;
	}
	 //// Function for pausing playback of the circle: audio and animation
	//
	Interface.pausePlayback = function() {
		if (Interface.audioIsPlaying()) Interface.pauseAudio();
		circle.setOptions({ fillColor: 'green', strokeColor: 'green' });
		clearInterval(aniTimer);
		funkyCircle1.setOptions({ visible: false });
		funkyCircle2.setOptions({ visible: false });
	}
	 //// Function for stopping playback of the circle: audio and animation
	//
	Interface.stopPlayback = function() {
		if (Interface.audioIsPlaying()) Interface.stopAudio();
		circle.setOptions({ fillColor: 'green', strokeColor: 'green' });
		clearInterval(aniTimer);
		funkyCircle1.setOptions({ visible: false });
		funkyCircle2.setOptions({ visible: false });
	}
	
	 //// Callback for user position change
	//
	var userIsInside  = false;
	var moveInMargin  = 2;//meters
	var moveOutMargin = 2;//meters
	Interface.onNewUserPosition = function(position) {
		var distance = google.maps.geometry.spherical.computeDistanceBetween
			(circle.getCenter(), position.latLng);
		
		if (!userIsInside && distance < circle.getRadius() - moveInMargin) {
			userIsInside = true;
			Interface.startPlayback();
		} else if (userIsInside && distance > circle.getRadius() + position.coords.accuracy + moveOutMargin) {
			userIsInside = false;
			Interface.stopPlayback();
		}
	}
	
	return Interface;
	
}]);




////'ts-area' HTML element
//
TS.directive('tsArea', function(){ return {
	controller:  'MapAreaController',
	restrict:    'E',
	templateUrl: 'partials/tsArea/tsArea.html',
	replace:      true,
	transclude:   true,
	scope:        true,
	
	link: function(scope, element, attrs, controller) {
		scope.lat    = scope.$eval(attrs.lat);
		scope.lng    = scope.$eval(attrs.lng);
		scope.radius = scope.$eval(attrs.radius);
		scope.audio  = attrs.audio;
		scope.audioElement = element.children("audio")[0];

		$(scope.audioElement).on('ended',  controller.stopPlayback);
		scope.$on('click.playing.ts-area', controller.pausePlayback);
		scope.$on('click.paused.ts-area',  controller.startPlayback);

		controller.init();
	}
}});



////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
