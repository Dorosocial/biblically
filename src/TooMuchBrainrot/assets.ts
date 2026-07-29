import {Exercise} from './schedule';

const VIDEO_DIR = 'neurolam/too-much-brainrot/video/distractors';
const SOUND_DIR = 'neurolam/too-much-brainrot/audio/distractors';

// Exercise -> distractor asset mapping, as confirmed against the filenames
// uploaded for this project. Exercises not listed here (ex1, ex4, ex5, ex7)
// have no distractor-video/-sound files — see the build report for why.
export const DISTRACTOR_VIDEOS: Partial<Record<Exercise, string[]>> = {
	intro: [`${VIDEO_DIR}/distractor-video-intro-darkroom.mp4`, `${VIDEO_DIR}/distractor-video-intro-bulb.mp4`],
	ex2: [
		`${VIDEO_DIR}/distractor-video-ex2-1-particles.mp4`,
		`${VIDEO_DIR}/distractor-video-ex2-1-lightleaks.mp4`,
		`${VIDEO_DIR}/distractor-video-ex2-2-particles.mp4`,
	],
	ex3: [`${VIDEO_DIR}/distractor-video-ex3-forest.mp4`, `${VIDEO_DIR}/distractor-video-ex3-ocean.mp4`],
	ex6: [`${VIDEO_DIR}/distractor-video-ex6-phone.mp4`],
	ex8: [`${VIDEO_DIR}/distractor-video-ex8-geometric.mp4`],
	ex9: [`${VIDEO_DIR}/distractor-video-ex9-crowd.mp4`, `${VIDEO_DIR}/distractor-video-ex9-traffic.mp4`],
	ex10: [`${VIDEO_DIR}/distractor-video-ex10-fastcut1.mp4`, `${VIDEO_DIR}/distractor-video-ex10-fastcut2.mp4`],
};

export const DISTRACTOR_SOUNDS: Partial<Record<Exercise, string[]>> = {
	ex6: [
		`${SOUND_DIR}/distractor-sound-ex6-1-notification.mp3`,
		`${SOUND_DIR}/distractor-sound-ex6-2-notification.mp3`,
		`${SOUND_DIR}/distractor-sound-ex6-1-buzz.mp3`,
		`${SOUND_DIR}/distractor-sound-ex6-alert.mp3`,
	],
	ex11: [`${SOUND_DIR}/distractor-sound-ex11-ping.mp3`],
};
