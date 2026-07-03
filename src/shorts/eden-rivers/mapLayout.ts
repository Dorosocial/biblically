// Hand-placed position/size for each independently-cropped map cutout
// within the content container, approximating real compass directions
// (Turkey north, Syria west, Iraq center, Havilah/Arabia south, Cush
// southeast, Gulf basin east) since the source PNGs aren't pre-registered
// to a shared coordinate system. Kept small/spread out — these are
// solid-fill cutouts, and several full-size copies overlapping would
// compound into an unreadable dark blob.
type Placement = {left: string; top: string; width: string};

// Rivers are code-drawn SVG paths (River.tsx / riverPaths.ts) sharing the
// same 334x600 canvas, not entries here.
export const MAP_LAYOUT: Record<string, Placement> = {
	base: {left: '5%', top: '3%', width: '90%'},
	turkey: {left: '32%', top: '4%', width: '28%'},
	syria: {left: '10%', top: '18%', width: '24%'},
	iraq: {left: '38%', top: '24%', width: '26%'},
	havilah: {left: '22%', top: '62%', width: '32%'},
	cush: {left: '54%', top: '50%', width: '24%'},
	gulfBasin: {left: '58%', top: '44%', width: '22%'},
	pin: {left: '60%', top: '46%', width: '11%'},
};

// Opacity for a previously-revealed element that is not the current
// scene's focus — keeps the composed map readable instead of every
// solid-fill cutout stacking at full opacity.
export const DIM_OPACITY = 0.32;

// Tight crops of the 334x600 canvas for scenes that only use a sub-region
// of the full map — reusing the full-size MAP_LAYOUT box for these would
// leave the visible content lopsided (clustered at the top or bottom)
// inside a mostly-empty container, breaking the "centered as a group"
// layout rule. Each crop's Placement percentages are relative to its own
// box (paired with the matching *_ASPECT and *_VIEWBOX for River paths),
// not the full canvas.

// Scenes 6-9 — Havilah/Cush/gulf-basin/pin, cropped to canvas region
// x:[52,285] y:[264,486].
export const SOUTH_LAYOUT: Record<string, Placement> = {
	havilah: {left: '9.2%', top: '48.6%', width: '45.9%'},
	cush: {left: '55.1%', top: '16.2%', width: '34.4%'},
	gulfBasin: {left: '60.8%', top: '0%', width: '31.5%'},
	pin: {left: '63.7%', top: '5.4%', width: '15.8%'},
};
export const SOUTH_ASPECT = 222 / 233;

// Scene 5 — Turkey/Syria/Iraq/pin + Tigris/Euphrates, cropped to canvas
// region x:[33.4,270] y:[24,327.8].
export const IDENTIFY_LAYOUT: Record<string, Placement> = {
	turkey: {left: '31.1%', top: '0%', width: '39.5%'},
	syria: {left: '0%', top: '27.7%', width: '33.9%'},
	iraq: {left: '39.5%', top: '39.5%', width: '36.7%'},
	pin: {left: '70.6%', top: '83%', width: '15.5%'},
};
export const IDENTIFY_ASPECT = 303.8 / 236.6;

// Scene 10 — gulf-basin + pin only, cropped to canvas region
// x:[193.7,267.2] y:[264,392.5].
export const BASIN_LAYOUT: Record<string, Placement> = {
	gulfBasin: {left: '0%', top: '0%', width: '100%'},
	pin: {left: '9.1%', top: '9.3%', width: '49.9%'},
};
export const BASIN_ASPECT = 128.5 / 73.5;
