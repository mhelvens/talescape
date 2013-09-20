define  (['jquery', 'angular', 'ng-ui/map'],
function ( $      ,  angular ) {
	
	
	//// Angular Talescape Submodules
	//
	angular.module('TS.service', []);
	angular.module('TS.directive', []);
	angular.module('TS.filter', []);
	
	
	
	//// Angular Talescape Main Module
	//
	var TS = angular.module('TS', ['TS.service','TS.directive','TS.filter','ui.map']);
	
	
	
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
		
		$scope.mapOptions = {
			zoom:   18,
			mapTypeId: google.maps.MapTypeId.SATELLITE,
			disableDefaultUI: true
		};
		
		$scope.mapAreas = new Array();
		
		function spawnMapArea(options) {
			var newScope = $scope.$new();
			$.extend(newScope, options);
			$scope.mapAreas.push(newScope);
			$controller('MapAreaController', {$scope: newScope});
		}
		
		// TODO: Don't use a delay, but find the correct callback.
		setTimeout(function(){
			spawnMapArea({
				latlng  : new google.maps.LatLng(52.3568734, 4.9536808),
				radius  : 20,
				audioURL: 'audio/cairnomount.mp3'
			});
			
			spawnMapArea({
				latlng  : new google.maps.LatLng(52.374216, 4.895168),
				radius  : 300,
				audioURL: 'audio/tail toddle.mp3'
			});
			
			spawnMapArea({
				latlng  : new google.maps.LatLng(52.365216, 4.875168),
				radius  : 300,
				audioURL: 'audio/saewill.mp3'
			});
		}, 1);
		
		
		function locationMarkerIcon(radius) {
			return {
            	url:        'img/marker.png',
				size:       new google.maps.Size (96, 96),
				origin:     new google.maps.Point(0, 0),
				anchor:     new google.maps.Point(radius, radius),
				scaledSize: new google.maps.Size (2*radius, 2*radius)
            };
		}
		
		
		
		//// Place the user location marker on the map
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
			
			locationMarker.setPosition(position.latLng);
			locationMarkerAccuracyCircle.setCenter(position.latLng);
			locationMarkerAccuracyCircle.setRadius(position.coords.accuracy);
		}
		
		
		//// Process updated user position
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
			
			for (i in $scope.mapAreas) {
				$scope.mapAreas[i].notifyUserPosition(position);
			}
			
		}
		
		$.webshims.ready('geolocation', function(){
			navigator.geolocation.watchPosition(updateGeoPosition);
		});
		
	}]);
	
	
	
	//// Google Map Area Controller
	//
	TS.controller('MapAreaController', ['$scope',
	                          function ( $scope ) {
		
		//// Create an area-specific HTML <audio> element,
		//// add some functions to control the audio and bind
		//// some relevant events.
		//
		$scope.audioElement = $("<audio class='areaAudio'>");
		function loadAudioFile(url) { $scope.audioElement[0].src = url;      }
		function playAudio()        { $scope.audioElement[0].play();         }
		function pauseAudio()       { $scope.audioElement[0].pause();        }
		function audioIsPlaying()   { return !$scope.audioElement[0].paused; }
		function stopAudio() {
			$scope.audioElement[0].pause();
			$scope.audioElement[0].currentTime = 0;
		}
		
		
		//// Load the audio URL specified in the $scope options
		//
		loadAudioFile($scope.audioURL);
		
		
		//// Options shared by all circle markers:
		//
		var circleCommonOptions = {
			center: $scope.latlng,
			radius: $scope.radius,
			draggable: false,
			editable: false,
			map: $scope.map,
			visible: true
		};
		
		
		//// Options specific to the main area circle:
		//
		var mainCircleOptions = $.extend({}, circleCommonOptions, {
			clickable: true,
			fillColor: 'green',
			fillOpacity: 0.4,
			strokeColor: 'green',
			strokeOpacity: 0.9,
			strokePosition: google.maps.INSIDE,
			strokeWeight: 4,
			zIndex: 2
		});
		
		
		//// Options specific to the 'wave' circles:
		//
		var funkyCircleOptions = $.extend({}, circleCommonOptions, {
			clickable: false,
			fillOpacity: 0,
			strokeColor: 'red',
			strokeOpacity: 0.9,
			strokeWeight: 3,
			strokePosition: google.maps.OUTSIDE,
			zIndex: 1
		});
		
		
		//// Create the circles.
		//
		$scope.circle       = new google.maps.Circle(mainCircleOptions );
		$scope.funkyCircle1 = new google.maps.Circle(funkyCircleOptions);
		$scope.funkyCircle2 = new google.maps.Circle(funkyCircleOptions);

		
		//// Implement the animation for the wave circles.
		//
		var aniSteps        = 50;
		var aniEndState     = 30;
		var startAniState   = 40;
		var secondWaveDelay = 10;
		function animationState(delay) { return ($scope.aniState + delay) % aniSteps; }
		function incrementAnimationState() { $scope.aniState = animationState(1); }
		function zoomScale() { return Math.pow(2, 15 - $scope.map.getZoom()) }
		function expandCircle() {
			incrementAnimationState();
			var state = animationState(0);
			$scope.funkyCircle1.setOptions({
				radius:       $scope.radius + zoomScale() * state * 2.5,
				strokeWeight: (3 - state * 3 / aniEndState),
				visible:      (state < 30)
			});
			state = animationState(secondWaveDelay);
			$scope.funkyCircle2.setOptions({
				radius:       $scope.radius + zoomScale() * state * 2.5,
				strokeWeight: (3 - state * 3 / aniEndState),
				visible:      (state < 30)
			});
		}
		
		
		//// Function for starting playback of the circle: audio and animation
		//
		function startPlayback() {
			playAudio();
			$scope.circle.setOptions({ fillColor: 'red', strokeColor: 'red' });
			$scope.timer = setInterval(expandCircle, 20);
			$scope.aniState = startAniState;
		}
		//// Function for pausing playback of the circle: audio and animation
		//
		function pausePlayback() {
			pauseAudio();
			$scope.circle.setOptions({ fillColor: 'green', strokeColor: 'green' });
			clearInterval($scope.timer);
			$scope.funkyCircle1.setOptions({ visible: false });
			$scope.funkyCircle2.setOptions({ visible: false });
		}
		//// Function for stopping playback of the circle: audio and animation
		//
		function stopPlayback() {
			stopAudio();
			$scope.circle.setOptions({ fillColor: 'green', strokeColor: 'green' });
			clearInterval($scope.timer);
			$scope.funkyCircle1.setOptions({ visible: false });
			$scope.funkyCircle2.setOptions({ visible: false });
		}
		
		
		//// Set the necessary listeners
		//
		google.maps.event.addListener($scope.circle, 'click', function() {
			if (audioIsPlaying()) // change to new method $scope.isPlaying()
			     { $scope.$emit('click.playing.maparea'); }
			else { $scope.$emit('click.paused.maparea');  }
		});
		$scope.audioElement.on('ended', stopPlayback);
		$scope.$on('click.playing.maparea', pausePlayback);
		$scope.$on('click.paused.maparea',  startPlayback);
		//google.maps.event.addListener($scope.map, 'zoom_changed', function() {
		//});
		
		
		//// Process user position
		//
		var userIsInside  = false;
		var moveInMargin  = 2;//meters
		var moveOutMargin = 2;//meters
		$scope.notifyUserPosition = function(position) {
			var distance = google.maps.geometry.spherical.computeDistanceBetween
				($scope.circle.getCenter(), position.latLng);
			
			if (!userIsInside && distance < $scope.circle.getRadius() - moveInMargin) {
				userIsInside = true;
				startPlayback();
			} else if (userIsInside && distance > $scope.circle.getRadius() + position.coords.accuracy + moveOutMargin) {
				userIsInside = false;
				stopPlayback();
			}
			
		}
		
	}]);
	
});
