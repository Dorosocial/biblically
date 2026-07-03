// Visual fingerprint for the "Red Sea" video: plain white background,
// silver/pale blue-gray offset stroke on every image cutout (baked in by
// src/shared/halftone_stroke.py's `silver` preset), full color/black fill
// where applicable, no halftone.
import compassCutout from './assets/processed/compass.png';
import footprintCutout from './assets/processed/footprint.png';
import mapAqabaCutout from './assets/processed/map-aqaba.png';
import mapSinaiCutout from './assets/processed/map-sinai.png';
import marshReedsCutout from './assets/processed/marsh-reeds.png';
import mountainsCorridorCutout from './assets/processed/mountains-corridor.png';
import openSeaCutout from './assets/processed/open-sea.png';

export const ASSETS = {
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
	// code line up exactly. Backgrounds on the white page (glow halos,
	// marker fills) lean on silverDeep instead — the pale `silver` alone
	// all but disappears against white.
	silver: '#B8C4CC',
	silverDeep: '#6E8894',
	// Dark ink for text/labels that sit directly on the white page.
	ink: '#122B32',
	inkDim: 'rgba(18, 43, 50, 0.65)',
	// Near-white text used only inside TextCard, which keeps its own dark
	// translucent card fill regardless of page background.
	cardText: '#F4F9FB',
	cardFill: 'rgba(5, 36, 40, 0.72)',
} as const;

// Every processed cutout in this video shares the same 334x600 source
// canvas, so a single aspect constant keeps every layer's proportions
// correct regardless of display width.
export const IMAGE_ASPECT = 600 / 334;
