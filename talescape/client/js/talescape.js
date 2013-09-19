define('talescape', ['jquery', 'angular', 'ng-ui/map'],
		   function ( $      ,  angular ) {
	
	angular.module('TS.service', []);
		/*.factory('audio', function() {
			var audioElement = $("<audio id='audio'>")[0];
			$('html').append( audioElement );
			
			return {
				play:      function()    { audioElement.play();    },
				pause:     function()    { audioElement.pause();   },
				load:      function(url) { audioElement.src = url; },
				isPlaying: function()    { return !audioElement.paused; },
				isPaused:  function()    { return  audioElement.paused; }
			};
		});*/
	
	angular.module('TS.directive', []);
	
	angular.module('TS.filter', []);
	
	var TS = angular.module('TS', ['TS.service','TS.directive','TS.filter','ui.map']);
	
	TS.controller('ApplicationController', ['$scope',
	      	                      function ( $scope ) {
		$scope.title = 'Talescape';
	}]);
	
	TS.controller('MapAreaController', ['$scope',
	                          function ( $scope ) {
		
		$scope.audioElement = $("<audio class='areaAudio'>");
		function loadAudioFile(url) { $scope.audioElement[0].src = url; }
		function playAudio()        { $scope.audioElement[0].play(); }
		function pauseAudio()       { $scope.audioElement[0].pause(); }
		
		loadAudioFile($scope.audioURL);
		
		$scope.circle = new google.maps.Circle({
			center: $scope.latlng,
			radius: $scope.radius,
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
			radius: $scope.radius,
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
		
		function startPlayback() {
			playAudio();
			$scope.circle.setOptions({ fillColor: 'red', strokeColor: 'red' });
			$scope.timer = setInterval(expandCircle, 20);
			$scope.aniState = startAniState;
		}
		
		function pausePlayback() {
			pauseAudio();
			$scope.circle.setOptions({ fillColor: 'green', strokeColor: 'green' });
			clearInterval($scope.timer);
			$scope.funkyCircle1.setOptions({ visible: false });
			$scope.funkyCircle2.setOptions({ visible: false });
		}
		
		//google.maps.event.addListener($scope.map, 'zoom_changed', function() {
		//});
		
		google.maps.event.addListener($scope.circle, 'click', function() {
			if ($scope.audioElement[0].paused)
			     { $scope.$emit('click.paused.maparea'); }
			else { $scope.$emit('click.playing.maparea');  }
		});

		$scope.$on('click.playing.maparea', pausePlayback);
		$scope.$on('click.paused.maparea',  startPlayback);
		$scope.audioElement.on('ended', pausePlayback);
	}]);
	
	TS.controller('MapController', ['$scope', '$controller',
	                      function ( $scope ,  $controller) {
		
		$scope.mapOptions = {
			center: new google.maps.LatLng(35.784, -78.670),
			zoom:   15,
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			disableDefaultUI: true
		};
		
		$scope.mapAreas = new Array();
		
		function spawnMapArea(options) {
			var newScope = $scope.$new();
			$.extend(newScope, options);
			$scope.mapAreas.push($controller(
				'MapAreaController', {$scope: newScope}
			));
		}
		
		// TODO: Don't use a delay, but find the correct callback.
		setTimeout(function(){
			spawnMapArea({
				latlng  : new google.maps.LatLng(35.784, -78.670),
				radius  : 200,
				audioURL: 'audio/cairnomount.mp3'
			});
			
			spawnMapArea({
				latlng  : new google.maps.LatLng(35.784, -78.640),
				radius  : 300,
				audioURL: 'audio/tail toddle.mp3'
			});
			
			spawnMapArea({
				latlng  : new google.maps.LatLng(35.774, -78.655),
				radius  : 300,
				audioURL: 'audio/saewill.mp3'
			});
		}, 1);
		
		
	}]);
	
});
