////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define(function () { ///////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	return function (_audioElement) { //////////////////////////////////////////////////////////////////////////////////
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


		///////////////////////////////
		////// Private variables //////
		//////                   //////

		var _volume = 0;

		_refreshVolume();

		// TODO: find out if we need to store volume locally, or if _audioElement.volume stays valid when paused


		////////////////////////////
		////// Public methods //////
		//////                //////

		//// Querying ////

		this.playing = function () { return !_audioElement.paused; };

		this.looping = function () { return this.playing() && _audioElement.loop; };

		this.paused = function () { return _audioElement.paused; };

		this.stopped = function () { return this.paused() && _audioElement.currentTime == 0; };


		//// Basic Controls ////

		this.play = function () {
			if (this.paused()) {
                _refreshVolume();
				_audioElement.play();
				_audioElement.loop = false;
			}
		};

		this.loop = function () {
			if (this.paused()) {
				_audioElement.play();
				_refreshVolume();
				_audioElement.loop = true;
			}
		};

		this.pause = function () {
			if (this.playing()) {
				_audioElement.pause();
			}
		};

		this.stop = function () {
			if (this.playing()) {
				_audioElement.pause();
				_audioElement.currentTime = 0;
			}
		};


		//// Toggling ////

		this.togglePlayPause = function () { if (this.playing()) { this.pause(); } else { this.play(); } };

		this.toggleLoopPause = function () { if (this.playing()) { this.pause(); } else { this.loop(); } };

		this.togglePlayStop = function () { if (this.playing()) { this.stop(); } else { this.play(); } };

		this.toggleLoopStop = function () { if (this.playing()) { this.stop(); } else { this.loop(); } };


		//// Volume ////

		this.volume = function () { return _volume; };

		this.setVolume = function (newVol) {
			_volume = newVol;
			_refreshVolume();
		};


		/////////////////////////////
		////// Private methods //////
		//////                 //////

		function _refreshVolume() {
			_audioElement.volume = _volume;
			//_audioElement.load();
		}

	};


////////////////////////////////////////////////////////////////////////////////
});/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
