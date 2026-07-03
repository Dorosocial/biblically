// SVG path geometry for the four rivers, code-drawn instead of raster
// images per this video's fingerprint. All "map" paths live in the same
// 334x600 content canvas as the processed map/highlight PNGs (see theme.ts
// LAYOUT + mapLayout.ts) so they land near the correct region cutouts.
// Each scene-context below is its own visual vocabulary for the same
// rivers — a river's shape is free to change between scenes (e.g. Pishon
// becomes an encircling loop once Scene 6 introduces Havilah) since every
// scene is a clean reset.

export const CONTENT_VIEWBOX = '0 0 334 600';

// Scene 1 — no map yet, two small decorative unnamed rivers beside the Bible/Eden group.
export const GENERIC_VIEWBOX = '0 0 240 100';
export const GENERIC_RIVERS = {
	a: 'M10,50 C60,20 100,80 140,40 C170,15 200,55 230,30',
	b: 'M10,70 C60,95 100,45 140,85 C170,105 200,65 230,90',
} as const;

// Scenes 3-9 — four rivers converging on the gulf basin near Basra
// (~230,300 in the 334x600 canvas, matching MAP_LAYOUT.pin/gulfBasin). Each
// is an S-bend cubic (control points offset perpendicular to the
// start-end line) rather than a near-straight diagonal, so they read as
// meandering rivers.
export const MAP_RIVERS = {
	euphrates: 'M60,80 C84.5,177 203.8,200.8 230,300',
	tigris: 'M270,60 C222.3,133.4 278.1,224.2 230,300',
	pishon: 'M40,520 C136.8,476.8 131.3,345.4 230,300',
	gihon: 'M300,480 C304.9,409.7 225.8,372.1 230,300',
} as const;

// Scenes 6-9 — Pishon/Gihon reinterpreted as closed loops once Havilah/Cush
// are introduced, so they visibly "encircle" those regions.
export const ENCIRCLE_HAVILAH = 'M202,426 C202,459.1 168.4,486 127,486 C85.6,486 52,459.1 52,426 C52,392.9 85.6,366 127,366 C168.4,366 202,392.9 202,426 Z';
export const ENCIRCLE_CUSH = 'M285,342 C285,372.4 255.9,397 220,397 C184.1,397 155,372.4 155,342 C155,311.6 184.1,287 220,287 C255.9,287 285,311.6 285,342 Z';

// Cropped viewBoxes matching the *_LAYOUT groups in mapLayout.ts — same
// path data as MAP_RIVERS/ENCIRCLE_*, just a tighter camera window so a
// sub-region of the map fills its scene's box instead of floating inside
// mostly-empty space.
export const SOUTH_VIEWBOX = '52 264 233 222';
export const IDENTIFY_VIEWBOX = '33.4 24 236.6 303.8';

// Scenes 12-15 — the dry valley: four rivers converging down from the
// mountain band across the top of the frame.
export const VALLEY_RIVERS = {
	euphrates: 'M140,140 C171.2,126.7 168.2,84 200,70',
	tigris: 'M200,150 C226.6,130.3 213,90.5 240,70',
	pishon: 'M90,150 C121.8,132.6 117.6,88.2 150,70',
	gihon: 'M230,160 C251,136 239,100 260,75',
} as const;
