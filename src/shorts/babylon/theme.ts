// Visual fingerprint for the "Babylon" video: plain white background, gold
// offset stroke on every image cutout (baked in by
// src/shared/halftone_stroke.py), full color where applicable.
import backgroundImg from './assets/background.jpeg';
import chariot from './assets/processed/chariot.png';
import citySilhouette from './assets/processed/city-silhouette.png';
import cityWall from './assets/processed/city-wall.png';
import crown from './assets/processed/crown.png';
import mapIraq from './assets/processed/map-iraq.png';
import nebuchadnezzar from './assets/processed/nebuchadnezzar.png';
import ruins from './assets/processed/ruins.png';

export const ASSETS = {
	background: backgroundImg,
	ruins,
	mapIraq,
	crown,
	nebuchadnezzar,
	citySilhouette,
	cityWall,
	chariot,
} as const;

export const COLORS = {
	// Matches the GOLD preset in src/shared/halftone_stroke.py so the
	// stroke baked into the PNGs and any gold-accented elements drawn in
	// code line up exactly.
	gold: '#D4AF37',
	goldDeep: '#B8912C',
	// Near-black ink for code-drawn line art / text, readable on white.
	ink: '#1A1A1A',
	inkFaint: 'rgba(26, 26, 26, 0.55)',
} as const;

// Aspect ratios (height/width) of each cropped cutout — used so
// width-based sizing renders every layer at its correct proportions.
export const ASSET_ASPECT = {
	ruins: 534 / 334,
	mapIraq: 572 / 334,
	crown: 231 / 318,
	nebuchadnezzar: 574 / 301,
	citySilhouette: 222 / 334,
	cityWall: 206 / 334,
	chariot: 198 / 333,
} as const;
