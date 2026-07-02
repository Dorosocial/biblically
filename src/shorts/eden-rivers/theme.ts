// Visual fingerprint for the "Eden's Rivers" video. Shared by every scene
// in this video so colors/assets stay in sync as scenes are added.
import backgroundImg from './assets/background.jpeg';
import bibleCutout from './assets/processed/bible.png';

export const ASSETS = {
	background: backgroundImg,
	bible: bibleCutout,
} as const;

export const COLORS = {
	// Matches the CYAN constant in src/shared/halftone_stroke.py so the
	// stroke baked into the PNGs and any stroke-colored elements drawn in
	// code line up exactly.
	strokeCyan: '#00FFFF',
	mapLine: 'rgba(219, 233, 245, 0.55)',
	mapLabel: 'rgba(219, 233, 245, 0.85)',
} as const;
