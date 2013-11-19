////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(function () { ///////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	return function (element) { ////////////////////////////////////////////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


		///////////////////////////////
		////// Private variables //////
		//////                   //////


		var _audioElement = element;
		var _volume = 0;

		// TODO: find out if we need to store volume locally, or if _audioElement.volume stays valid when paused


		////////////////////////////
		////// Public methods //////
		//////                //////


		//// Querying ////

		this.playing = function playing() { return !_audioElement.paused; };

		this.looping = function looping() { return this.playing() && _audioElement.loop; };

		this.paused = function paused() { return _audioElement.paused; };

		this.stopped = function stopped() { return this.paused() && _audioElement.currentTime == 0; };


		//// Basic Controls ////

		this.play = function play() {
			if (this.paused()) {
				_audioElement.play();
				_refreshVolume();
				_audioElement.loop = false;
			}
		};

		this.loop = function loop() {
			if (this.paused()) {
				_audioElement.play();
				_refreshVolume();
				_audioElement.loop = true;
			}
		};

		this.pause = function pause() {
			if (this.playing()) {
				_audioElement.pause();
			}
		};

		this.stop = function stop() {
			if (this.playing()) {
				_audioElement.pause();
				_audioElement.currentTime = 0;
			}
		};


		//// Toggling ////

		this.togglePlayPause = function togglePlayPause() { if (this.playing()) { this.pause(); } else { this.play(); } };

		this.toggleLoopPause = function toggleLoopPause() { if (this.playing()) { this.pause(); } else { this.loop(); } };

		this.togglePlayStop = function togglePlayStop() { if (this.playing()) { this.stop(); } else { this.play(); } };

		this.toggleLoopStop = function toggleLoopStop() { if (this.playing()) { this.stop(); } else { this.loop(); } };


		//// Volume ////

		this.volume = function volume() { return _volume; };

		this.setVolume = function setVolume(newVol) { _audioElement.volume = _volume = newVol; };


		/////////////////////////////
		////// Private methods //////
		//////                 //////


		function _refreshVolume() {
			_audioElement.volume = _volume;
		}

	};


////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
