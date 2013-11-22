'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['jquery', 'gmaps', 'angular', 'UserPosition', 'SourceEditor', 'TS'],
		function ($, gmaps, angular, UserPosition, SourceEditor) {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


			////////////////////////////////////////////////////////////
			// MapController ///////////////////////////////////////////
			////////////////////////////////////////////////////////////


			angular.module('TS').controller('MapController', ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {


				var object = {};


				/////////////////////////////
				////// Create the Map //////
				//////                //////


				var _map = new gmaps.Map($element.children(".canvas")[0], {
					// fixed options
					mapTypeId       : gmaps.MapTypeId.SATELLITE,  // default: satellite view
					disableDefaultUI: true,                       // default: no controls
					styles          : [
						{featureType: "all", elementType: "labels", stylers: [
							{visibility: "off"}
						]}
					],
					zoom            : parseInt($attrs['zoom']) || 20,           // start zoom level
					center          : new gmaps.LatLng(
							parseFloat($attrs['lat']) || 52.3564841,
							parseFloat($attrs['lng']) || 4.9520856)   // start location (default: CWI)
				});


				/////////////////////////////////////////////////
				////// Manage the User Position on the Map //////
				//////                                     //////


				var _userPos = new UserPosition(_map);


				/////////////////////////////////////////////////
				////// Manage the Source Editor on the Map //////
				//////                                     //////


				// var _editor = new
				SourceEditor(_map);


				///////////////////////////////////////////////////////////
				////// Managing Sound Sources / Starting all at Once //////
				//////                                               //////


				////////////////////////////
				////// Public methods //////
				//////                //////


				object.onNewUserPos = function (handler) {
					_userPos.onNewPos(handler);
				};

				object.userPos = function () {
					return _userPos.pos();
				};

				object.map = function () {
					return _map;
				};

				var _sourceRegisteredCallback = $.Callbacks('unique');

				object.registerSource = function (source) {
					_sourceRegisteredCallback.fire(source);
				};

				object.onSourceRegistered = function (handler) {
					_sourceRegisteredCallback.add(handler);
				};


				////////////////////////////


				$.extend(this, object);


			}]);


			////////////////////////////////////////////////////////////
			// 'ts-map' Directive //////////////////////////////////////
			////////////////////////////////////////////////////////////


			angular.module('TS').directive('tsMap', function () {
				return {
					controller : 'MapController',
					restrict   : 'E',
					templateUrl: 'partials/tsMap/tsMap.html',
					replace    : true,
					transclude : true,
					scope      : {}
				};
			});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
