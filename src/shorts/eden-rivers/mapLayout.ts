// Hand-placed position/size for each independently-cropped map cutout
// within the content container, approximating real compass directions
// (Turkey north, Syria west, Iraq center, Havilah/Arabia south, Cush
// southeast, Gulf basin east) since the source PNGs aren't pre-registered
// to a shared coordinate system. Kept small/spread out — these are
// solid-fill cutouts, and several full-size copies overlapping would
// compound into an unreadable dark blob.
type Placement = {left: string; top: string; width: string};

export const MAP_LAYOUT: Record<string, Placement> = {
	base: {left: '5%', top: '3%', width: '90%'},
	turkey: {left: '32%', top: '4%', width: '28%'},
	syria: {left: '10%', top: '18%', width: '24%'},
	iraq: {left: '38%', top: '24%', width: '26%'},
	havilah: {left: '22%', top: '62%', width: '32%'},
	cush: {left: '54%', top: '50%', width: '24%'},
	gulfBasin: {left: '58%', top: '44%', width: '22%'},
	pin: {left: '60%', top: '46%', width: '11%'},
	euphrates: {left: '26%', top: '8%', width: '24%'},
	tigris: {left: '48%', top: '10%', width: '22%'},
	pishon: {left: '6%', top: '14%', width: '28%'},
	gihon: {left: '42%', top: '16%', width: '24%'},
};

// Opacity for a previously-revealed element that is not the current
// scene's focus — keeps the composed map readable instead of every
// solid-fill cutout stacking at full opacity.
export const DIM_OPACITY = 0.32;
