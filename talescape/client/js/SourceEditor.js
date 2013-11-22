'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(['gmaps'], function (gmaps) {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	return function (_map) {
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


		var object = {};


		////////////////////////////
		////// Common Options //////
		//////                //////


		var editableRadiusOptions = {
			map           : _map,
			clickable     : false,
			draggable     : true,
			editable      : true,
			fillColor     : 'yellow',
			fillOpacity   : 0.4,
			strokeColor   : 'yellow',
			strokeOpacity : 0.9,
			strokePosition: gmaps.INSIDE,
			strokeWeight  : 4,
			zIndex        : 12, // radius circle must appear in front of reach circle and path
			visible       : true
		};

		var editableReachOptions = {
			map           : _map,
			clickable     : false,
			draggable     : false,
			editable      : true,
			fillOpacity   : 0,
			strokeColor   : 'yellow',
			strokeOpacity : 0.9,
			strokePosition: gmaps.OUTSIDE,
			strokeWeight  : 1,
			zIndex        : 11,
			visible       : true
		};

		var editablePathOptions = {
			clickable    : false,
			draggable    : true,
			editable     : true,
			strokeColor  : 'yellow',
			strokeOpacity: 0.9,
			strokeWeight : 2,
			zIndex       : 11,
			visible      : true,
			icons        : [
				{
					offset: '100%',
					icon  : {
						path        : gmaps.SymbolPath.FORWARD_OPEN_ARROW,
						strokeWeight: 2,
						scale       : 4
					}
				}
			]
		};


		//////////////////////////////////////
		////// Adding new Sound Sources //////
		//////                          //////


		var _drawingManager = new gmaps.drawing.DrawingManager({
			map                  : _map,
			circleOptions        : editableRadiusOptions,
			polylineOptions      : editablePathOptions,
			drawingControlOptions: { drawingModes: [
				gmaps.drawing.OverlayType.CIRCLE,
				gmaps.drawing.OverlayType.POLYLINE
			] }
		});

		gmaps.event.addListener(_drawingManager, 'circlecomplete', function (radiusCircle) {
			var newSource = {
				radius: radiusCircle,
				reach : new gmaps.Circle($.extend({
					center: radiusCircle.getCenter(),
					radius: radiusCircle.getRadius() + 30 * Math.pow(2, 18 - _map.getZoom())
				}, editableReachOptions))
			};

			_prepareEditableSource(newSource);

			_drawingManager.setDrawingMode(null);

			_logNewSourceInfo();
		});

		gmaps.event.addListener(_drawingManager, 'polylinecomplete', function (path) {
			var center = path.getPath().getAt(0);
			var newSource = {
				path  : path,
				radius: new gmaps.Circle($.extend({
					center: center,
					radius: 10 * Math.pow(2, 18 - _map.getZoom())
				}, editableRadiusOptions)),
				reach : new gmaps.Circle($.extend({
					center: center,
					radius: (10 + 30) * Math.pow(2, 18 - _map.getZoom())
				}, editableReachOptions))
			};

			_prepareEditableSource(newSource);

			gmaps.event.addListener(newSource.radius, 'center_changed', function () {
				newSource.path.getPath().setAt(0, newSource.radius.getCenter());
				_logNewSourceInfo();
			});

			gmaps.event.addListener(path.getPath(), 'insert_at', function () { _logNewSourceInfo(); });
			gmaps.event.addListener(path.getPath(), 'remove_at', function () { _logNewSourceInfo(); });
			gmaps.event.addListener(path.getPath(), 'set_at', function () { _logNewSourceInfo(); });

			_drawingManager.setDrawingMode(null);

			_logNewSourceInfo();
		});

		function _prepareEditableSource(newSource) {
			gmaps.event.addListener(newSource.radius, 'center_changed', function () {
				newSource.reach.setCenter(newSource.radius.getCenter());
				_logNewSourceInfo();
			});

			gmaps.event.addListener(newSource.radius, 'radius_changed', function () {
				if (newSource.reach.getRadius() < newSource.radius.getRadius() + 5) {
					newSource.reach.setRadius(newSource.radius.getRadius() + 5);
				}
				_logNewSourceInfo();
			});

			gmaps.event.addListener(newSource.reach, 'radius_changed', function () {
				if (newSource.reach.getRadius() < newSource.radius.getRadius() + 5) {
					newSource.radius.setRadius(Math.max(2, newSource.reach.getRadius() - 5));
				}
				_logNewSourceInfo();
			});

			gmaps.event.addListener(newSource.radius, 'center_changed', function () {
				newSource.reach.setCenter(newSource.radius.getCenter());
				_logNewSourceInfo();
			});

			return _newSources.push(newSource);
		}


		///////////////////////////////////////
		////// Logging new Sound Sources //////
		//////                           //////


		var _newSources = [];
		var _OKtoLog = true;

		function _logNewSourceInfo() {
			if (_OKtoLog) {
				_OKtoLog = false;
				window.setTimeout(function () { _OKtoLog = true; }, 100);
				console.debug("----------------------------------------");
				_newSources.map(function (s) {
					//noinspection JSValidateTypes
					console.debug('<ts-area lat="{{1}}" lng="{{2}}" radius="{{3}}" reach="{{4}}"{{5}} audio=""></ts-area>'
							.format(s.radius.getCenter().lat(),
									s.radius.getCenter().lng(),
									s.radius.getRadius(),
									s.reach.getRadius(),
									!s.path ? "" :
									' path="' + gmaps.geometry.encoding.encodePath(s.path.getPath())
											.replace(/(\\|")/g, '\\$1') + '"'));
				});
				console.debug("----------------------------------------");
			}
		}


		////////////////////////////
		////// Public Methods //////
		//////                //////


		// none, so far


		////////////////////////////

		$.extend(this, object);

//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	};
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
