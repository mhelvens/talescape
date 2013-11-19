export class AudioPlayer {
	constructor(element: Element);


	//// Querying
	//
	playing(): boolean;

	looping(): boolean; // implies playing

	paused(): boolean; // implies !playing

	stopped(): boolean; // implies paused


	//// Basics controls
	//
	play(): void;

	loop(): void;

	pause(): void;

	stop(): void;


	//// Toggling
	//
	togglePlayStop(): void;

	togglePlayPause(): void;

	toggleLoopPause(): void;

	toggleLoopStop(): void;


	//// Volume
	//
	volume(): number;

	setVolume(newVol: number): void;
}
