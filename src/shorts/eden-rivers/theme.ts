// Visual fingerprint for the "Eden's Rivers" video. Shared by every scene
// in this video so colors/assets stay in sync as scenes are added.
import backgroundImg from './assets/background.jpeg';
import bibleCutout from './assets/processed/bible.png';
import dryValleyCutout from './assets/processed/dry-valley.png';
import waterTextureCutout from './assets/processed/water-texture.png';

export const ASSETS = {
	background: backgroundImg,
	bible: bibleCutout,
	dryValley: dryValleyCutout,
	waterTexture: waterTextureCutout,
} as const;

export const COLORS = {
	// Matches the CYAN constant in src/shared/halftone_stroke.py so the
	// stroke baked into the PNGs and any stroke-colored elements drawn in
	// code line up exactly.
	strokeCyan: '#00FFFF',
	mapLine: 'rgba(219, 233, 245, 0.55)',
	mapLabel: 'rgba(219, 233, 245, 0.85)',
} as const;

// Shared content-region layout: the Bible cutout is pinned at the top of
// every scene; map/valley/water imagery sits in this band below it.
export const LAYOUT = {
	bibleTop: 180,
	bibleWidth: 420,
	contentTop: 990,
} as const;
