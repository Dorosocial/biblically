/**
 * Deep near-black violet-indigo backdrop — chosen so the glowing cyan
 * particle and the translucent violet wavefunction both read with maximum
 * contrast and separation from each other (cyan vs violet), while staying
 * dark enough that emissive materials are the dominant light source.
 */
export const theme = {
	backdrop: '#05040d',
	fogColor: '#0b0818',

	particleColor: '#7ef9ff',
	particleGlow: '#e8ffff',

	waveColor: '#a78bfa',
	waveColorBright: '#d9c9ff',

	classicalBall: '#e2b45c',
	classicalBallDim: '#8a713a',

	ghostBall: '#ff6b6b',

	barrierColor: '#3a3f52',
	barrierLit: '#6b7290',

	screenColor: '#1a1f33',
	bandBright: '#eaf4ff',
	bandDark: '#0a0e1c',

	detectorOff: '#3a3f52',
	detectorOn: '#ffd166',

	textPrimary: '#f5f8ff',
	textDim: '#9fa8c9',
} as const;

export const fontStack = "'Helvetica Neue', Arial, 'Segoe UI', sans-serif";
