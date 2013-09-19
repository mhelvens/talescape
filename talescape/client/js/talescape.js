define('talescape', ['jquery', 'angular', 'ng-ui/map'],
		   function ( $      ,  angular ) {
	
	angular.module('TS.service', [])
		.factory('audio', function() {
			var audioElement = $("<audio id='audio'>")[0];
			$('html').append( audioElement );
			
			return {
				play:      function()    { audioElement.play();    },
				pause:     function()    { audioElement.pause();   },
				load:      function(url) { audioElement.src = url; },
				isPlaying: function()    { return !audioElement.paused; },
				isPaused:  function()    { return  audioElement.paused; }
			};
		});
	
	angular.module('TS.directive', []);
	
	angular.module('TS.filter', []);
	
	var TS = angular.module('TS', ['TS.service','TS.directive','TS.filter','ui.map']);
	
	TS.controller('ApplicationController', ['$scope',
	      	                      function ( $scope ) {
		$scope.title = 'Talescape';
	}]);
	
	TS.controller('MapAreaController', ['audio', '$scope',
	                          function ( audio ,  $scope ) {
		
		$scope.latlng    = new google.maps.LatLng(35.784, -78.670);
		$scope.radius    = 200;
		$scope.audioFile = 'audio/tail toddle.mp3';

		audio.load($scope.audioFile);
		
		$scope.circle = new google.maps.Circle({
			center: $scope.latlng,
			radius: 200,
			clickable: true,
			draggable: false,
			editable: false,
			fillColor: 'green',
			fillOpacity: 0.4,
			strokeColor: 'green',
			strokeOpacity: 0.9,
			strokePosition: google.maps.INSIDE,
			strokeWeight: 4,
			map: $scope.map,
			visible: true,
			zIndex: 2
		});
		
		var funkyCircleOptions = {
			center: $scope.latlng,
			radius: $scope.circleWidth,
			clickable: true,
			draggable: false,
			editable: false,
			fillOpacity: 0,
			strokeColor: 'red',
			strokeOpacity: 0.9,
			strokeWeight: 3,
			strokePosition: google.maps.OUTSIDE,
			map: $scope.map,
			visible: true,
			zIndex: 1
		};
		$scope.funkyCircle1 = new google.maps.Circle(funkyCircleOptions);
		$scope.funkyCircle2 = new google.maps.Circle(funkyCircleOptions);

		var aniSteps        = 50;
		var aniEndState     = 30;
		var startAniState   = 40;
		var secondWaveDelay = 10;
		function animationState(delay) { return ($scope.aniState + delay) % aniSteps; }
		function incrementAnimationState() { $scope.aniState = animationState(1); }
		function zoomScale() { return Math.pow(2, 15 - $scope.zoom) }
		
		
		$scope.expandCircle = function() {
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
		};
		
		google.maps.event.addListener($scope.circle, 'click', function() {
			if (audio.isPlaying()) {
				audio.pause();
				$scope.circle.setOptions({ fillColor: 'green', strokeColor: 'green' });
				clearInterval($scope.timer);
				$scope.funkyCircle1.setOptions({visible: false});
				$scope.funkyCircle2.setOptions({visible: false});
			} else {
				audio.play();
				$scope.circle.setOptions({ fillColor: 'red', strokeColor: 'red' });
				$scope.timer = setInterval($scope.expandCircle, 20);
				$scope.aniState = startAniState;
			}
		});
		
	}]);
	
	TS.controller('MapController', ['$scope', '$controller',
	                      function ( $scope ,  $controller) {

		$scope.latlng = new google.maps.LatLng(35.784, -78.670);
		$scope.zoom   = 15;
		
		$scope.mapOptions = {
			center: $scope.latlng,
			zoom:   $scope.zoom,
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			disableDefaultUI: true
		};
		
		// TODO: Don't use a delay, find the correct callback.
		setTimeout(function(){
			google.maps.event.addListener($scope.map, 'zoom_changed', function() {
				$scope.zoom = $scope.map.getZoom();
			});
			$controller('MapAreaController', {$scope: $scope.$new()});
		}, 1000);
		
		
	}]);
	
});
