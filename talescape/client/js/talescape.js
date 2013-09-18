define('talescape', ['jquery', 'angular', 'ng-ui/map'],
		   function ( $      ,  angular ){
	
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
	
	var Talescape = angular.module('TS', ['TS.service','TS.directive','TS.filter','ui.map'])
		.run(function(){
			
			
		});
	
	Talescape.controller('AudioSpotController', ['audio', '$scope',
	                                   function ( audio ,  $scope ) {
		$scope.gpsCoordinates = 'someplace';
		$scope.radius         = '';
		$scope.audioFile      = 'audio/cairnomount.mp3';
		
		$scope.buttonText = "Play";
		
		audio.load($scope.audioFile);
		
		$scope.play = function() {
			if (audio.isPlaying()) {
				audio.pause();
				$scope.buttonText = "Play";
			} else {
				audio.play();
				$scope.buttonText = "Pause";
			}
		};
	}]);
	
	Talescape.controller('MapController', ['$scope',
	                             function ( $scope ) {
		$scope.mapOptions = {
			center: new google.maps.LatLng(35.784, -78.670),
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	}]);
	
});
