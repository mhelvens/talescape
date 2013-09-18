require.config({
	paths: {
		'async'      : 'lib/requirejs-plugins/src/async',
		'jquery'     : 'lib/jquery/jquery',
		'angular'    : 'lib/angular/angular',
		'ng-ui/map'  : 'lib/angular-ui-map/src/map',
		'ng-ui/event': 'lib/angular-ui-utils/modules/event/event'
	},
	shim: {
		'ng-ui/map'  : ['angular', 'ng-ui/event', 'gmaps'],
		'ng-ui/event': ['angular'],
		'angular'    : { exports: 'angular' }
	}
});

requirejs(['angular', 'talescape'], function(angular){
	angular.bootstrap(document, ['TS']);
});
