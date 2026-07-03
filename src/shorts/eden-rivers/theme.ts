// Visual fingerprint for the "Eden's Rivers" video. Shared by every scene
// in this video so colors/assets stay in sync as scenes are added.
import backgroundImg from './assets/background.jpeg';
import bibleCutout from './assets/processed/bible.png';
import depthArrow from './assets/processed/depth-arrow.png';
import dryValleyCutout from './assets/processed/dry-valley.png';
import highlightCush from './assets/processed/highlight-cush.png';
import highlightGulfBasin from './assets/processed/highlight-gulf-basin.png';
import highlightHavilah from './assets/processed/highlight-havilah.png';
import highlightIraq from './assets/processed/highlight-iraq.png';
import highlightSyria from './assets/processed/highlight-syria.png';
import highlightTurkey from './assets/processed/highlight-turkey.png';
import mapBase from './assets/processed/map-base.png';
import mountainRange from './assets/processed/mountain-range.png';
import pinMarker from './assets/processed/pin-marker.png';
import riverEuphrates from './assets/processed/river-euphrates.png';
import riverGihon from './assets/processed/river-gihon.png';
import riverPishon from './assets/processed/river-pishon.png';
import riverTigris from './assets/processed/river-tigris.png';
import waterTextureCutout from './assets/processed/water-texture.png';

export const ASSETS = {
	background: backgroundImg,
	bible: bibleCutout,
	dryValley: dryValleyCutout,
	waterTexture: waterTextureCutout,
	mapBase,
	riverTigris,
	riverEuphrates,
	riverPishon,
	riverGihon,
	highlightTurkey,
	highlightSyria,
	highlightIraq,
	highlightHavilah,
	highlightCush,
	highlightGulfBasin,
	pinMarker,
	mountainRange,
	depthArrow,
} as const;

export const COLORS = {
	// Matches the WHITE preset in src/shared/halftone_stroke.py so the
	// stroke baked into the PNGs and any stroke-colored elements drawn in
	// code line up exactly.
	stroke: '#FFFFFF',
	label: 'rgba(255, 255, 255, 0.9)',
	labelDim: 'rgba(219, 233, 245, 0.75)',
} as const;

// Shared content-region layout: the Bible cutout is pinned at the top of
// every scene; map/valley/water imagery sits in this band below it. All
// processed map/geography PNGs share the same 334x600 canvas, so a single
// content width keeps every layer aligned.
export const LAYOUT = {
	bibleTop: 180,
	bibleWidth: 420,
	contentTop: 990,
	contentWidth: 520,
} as const;

export const IMAGE_ASPECT = 600 / 334;
