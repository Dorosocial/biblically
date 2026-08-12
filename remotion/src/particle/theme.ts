/**
 * Deep violet-indigo backdrop — chosen so the glowing cyan particle and the
 * translucent violet wavefunction both read with maximum contrast and
 * separation from each other (cyan vs violet). Lightened from the original
 * near-black pass (which read as "can't see anything" on real screens) while
 * staying dark enough that emissive materials still pop.
 */
export const theme = {
	backdrop: '#161331',
	fogColor: '#221e46',

	particleColor: '#7ef9ff',
	particleGlow: '#e8ffff',

	waveColor: '#a78bfa',
	waveColorBright: '#d9c9ff',

	classicalBall: '#e2b45c',
	classicalBallDim: '#8a713a',

	ghostBall: '#ff6b6b',

	barrierColor: '#6b7296',
	barrierLit: '#a3abd6',

	screenColor: '#333a63',
	bandBright: '#f4f8ff',
	bandDark: '#2b2f52',

	detectorOff: '#6b7296',
	detectorOn: '#ffd166',

	textPrimary: '#f5f8ff',
	textDim: '#b6bede',
} as const;

export const fontStack = "'Helvetica Neue', Arial, 'Segoe UI', sans-serif";
