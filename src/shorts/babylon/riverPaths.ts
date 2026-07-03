// SVG paths must be designed in a coordinate space whose aspect ratio
// matches the container they're drawn into (preserveAspectRatio="none"
// stretches x and y independently — a mismatched viewBox turns gentle
// curves into near-straight lines). x always spans 0-100 (percent of
// width); y spans 0-100*aspect so 1 unit means the same physical distance
// in both directions.
const mapAspect = 1.71; // map-iraq.png cropped aspect (h/w)
const ruinsAspect = 1.6; // ruins.png cropped aspect (h/w)

export const MAP_VIEWBOX = `0 0 100 ${100 * mapAspect}`;
export const RUINS_VIEWBOX = `0 0 100 ${100 * ruinsAspect}`;

// Baghdad and Babylon's approximate positions on map-iraq.png, as CSS-style
// percentages (0-100 for both x and y) — used directly for MapPin/Label
// `left`/`top`. Schematic placement (the source cutout isn't
// geo-registered), Babylon just south of Baghdad along the river.
export const BAGHDAD_POINT = {x: 50, y: 40};
export const BABYLON_POINT = {x: 40, y: 58};

// Same two points converted into the map's aspect-corrected SVG path space
// (y * mapAspect), for River/DistanceLine path coordinates.
export const BAGHDAD_SVG = {x: BAGHDAD_POINT.x, y: BAGHDAD_POINT.y * mapAspect};
export const BABYLON_SVG = {x: BABYLON_POINT.x, y: BABYLON_POINT.y * mapAspect};

// Euphrates, passing close to both points (Scenes 3-4).
export const MAP_EUPHRATES =
	'M58,10 C68,28 50,42 55,58 C58,66 52,68 51,68.4 C46,76 40,82 40,92.8 C36,108 46,122 38,140 C32,154 40,166 34,171';

// Tigris, running close to the Euphrates near Babylon without merging (Scene 4).
export const MAP_TIGRIS =
	'M80,14 C76,32 84,44 76,58 C68,72 60,80 52,86 C46,90 42,90 40,92.8 C36,104 42,116 34,128';

// Euphrates tracing past the ruins (Scene 10), roughly following the river
// already painted into ruins.png along its eastern edge, continuing beyond
// the frame per "still runs right past those ruins."
export const RUINS_EUPHRATES =
	'M92,2 C86,16 96,28 90,44 C85,56 94,66 96,82 C98,94 88,104 92,120 C95,132 86,144 90,160';
