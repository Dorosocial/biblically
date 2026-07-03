// Visual fingerprint for the "Red Sea" video: teal/aqua grid background,
// silver/pale blue-gray offset stroke on every image cutout (baked in by
// src/shared/halftone_stroke.py's `silver` preset), full color/black fill
// where applicable, no halftone.
import backgroundImg from './assets/processed/background.jpeg';
import compassCutout from './assets/processed/compass.png';
import footprintCutout from './assets/processed/footprint.png';
import mapAqabaCutout from './assets/processed/map-aqaba.png';
import mapSinaiCutout from './assets/processed/map-sinai.png';
import marshReedsCutout from './assets/processed/marsh-reeds.png';
import mountainsCorridorCutout from './assets/processed/mountains-corridor.png';
import openSeaCutout from './assets/processed/open-sea.png';

export const ASSETS = {
	background: backgroundImg,
	marshReeds: marshReedsCutout,
	openSea: openSeaCutout,
	footprint: footprintCutout,
	compass: compassCutout,
	mapSinai: mapSinaiCutout,
	mapAqaba: mapAqabaCutout,
	mountainsCorridor: mountainsCorridorCutout,
} as const;

export const COLORS = {
	// Matches the SILVER preset in src/shared/halftone_stroke.py so the
	// stroke baked into the PNGs and any stroke-colored elements drawn in
	// code line up exactly.
	silver: '#B8C4CC',
	silverDeep: '#8FA3AE',
	// Near-white, cool-tinted text/ink — reads clearly against the dark
	// teal grid background.
	text: '#F2F9FB',
	textDim: 'rgba(242, 249, 251, 0.72)',
	// Translucent dark-teal card fill, keeps the grid fingerprint visible
	// behind headline text instead of a fully opaque box.
	cardFill: 'rgba(5, 36, 40, 0.55)',
} as const;

// Every processed cutout in this video shares the same 334x600 source
// canvas, so a single aspect constant keeps every layer's proportions
// correct regardless of display width.
export const IMAGE_ASPECT = 600 / 334;
