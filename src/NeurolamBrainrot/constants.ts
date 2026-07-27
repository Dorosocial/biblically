export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION = 10800;

export const CENTER_X = WIDTH / 2;
export const CENTER_Y = HEIGHT / 2;

// Dot + exclusion zone. Exclusion buffer sits within the requested 80-100px range.
export const DOT_RADIUS = 68;
export const EXCLUSION_BUFFER = 92;
export const EXCLUSION_RADIUS = DOT_RADIUS + EXCLUSION_BUFFER;

export const BG_COLOR = '#0A0E14';
export const DOT_COLOR = '#FF2A2A';

// Section boundaries (frames), per spec.
export const SECTIONS = {
	intro: {start: 0, end: 300},
	round1: {start: 300, end: 2100},
	round2: {start: 2100, end: 4200},
	round3: {start: 4200, end: 6900},
	round4: {start: 6900, end: 9000},
	cooldown: {start: 9000, end: 10230},
	cooldownFadeDone: 9800,
	outro: {start: 10230, end: 10500},
	finalHold: {start: 10500, end: 10800},
} as const;

// Deterministic seeds so every render (studio + `remotion render`) produces
// byte-identical randomness. Never call Math.random() anywhere in this app.
export const SCHEDULE_SEED = 88172645;
export const DOT_FLASH_SEED = 424242;

export const AUDIO = {
	intro: 'audio/va-intro.mp3',
	round1: 'audio/va-round1.mp3',
	round2: 'audio/va-round2.mp3',
	round3: 'audio/va-round3.mp3',
	round4: 'audio/va-round4.mp3',
	outro: 'audio/va-outro.mp3',
} as const;
