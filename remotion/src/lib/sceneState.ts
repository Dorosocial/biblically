import {interpolate} from 'remotion';
import {FPS} from './timing';

/** A [timeSeconds, value] control point. */
type Point = [number, number];

const track = (points: Point[]) => {
	const ts = points.map((p) => p[0]);
	const vs = points.map((p) => p[1]);
	return (frame: number): number => {
		const t = frame / FPS;
		return interpolate(t, ts, vs, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	};
};

// ---------------------------------------------------------------------------
// CAMERA — one continuous move for the whole film. Every shot contributes a
// couple of control points describing where the camera arrives/departs, per
// the shot list's camera directions. The very last point matches the very
// first point exactly (pos [0,0,9], lookAt origin, fov 50) so the loop
// collapse match-cuts with zero pop.
// ---------------------------------------------------------------------------

// NOTE: camera authored as an explicit per-shot table below rather than one
// flat track, since several shots re-use x/y/z asymmetrically (orbits,
// lateral tracks). This keeps each shot's camera direction legible.
const CAM_POINTS: {t: number; pos: [number, number, number]; look: [number, number, number]; fov: number}[] = [
	{t: 0.0, pos: [0, 0, 9], look: [0, 0, 0], fov: 50},
	{t: 2.97, pos: [0, 0, 4.2], look: [0, 0, 0], fov: 36},
	{t: 3.3, pos: [0, 1.2, 7], look: [0, 0.3, 0], fov: 45},
	{t: 5.34, pos: [0, 1.4, 6.4], look: [0, 0.3, 0], fov: 45},
	{t: 7.73, pos: [0, 2.2, 11], look: [0, 0.5, 0], fov: 55},
	{t: 7.9, pos: [0, 1.0, 8], look: [0, 0.8, 0], fov: 50},
	{t: 10.38, pos: [0, 1.0, 3.5], look: [0, 0.9, 0], fov: 32},
	{t: 11.86, pos: [0, 1.0, 3.5], look: [0, 0.9, 0], fov: 32},
	{t: 11.9, pos: [1.6, 1.1, 4.6], look: [0.3, 1.0, 0], fov: 34},
	{t: 16.03, pos: [1.6, 1.1, 4.6], look: [0.3, 1.0, 0], fov: 34},
	{t: 16.05, pos: [0, 0, 6], look: [0, 0, 0], fov: 42},
	{t: 17.54, pos: [0, 0, 4.8], look: [0, 0, 0], fov: 36},
	{t: 17.56, pos: [-2.2, 0, 6], look: [-1, 0, 0], fov: 40},
	{t: 21.33, pos: [2.2, 0, 6], look: [1, 0, 0], fov: 40},
	{t: 24.58, pos: [0, 0.8, 13], look: [0, 0.2, 0], fov: 58},
	{t: 29.94, pos: [0, 1.6, 26], look: [0, 0.2, 0], fov: 70},
	{t: 31.5, pos: [0, 1.9, 24], look: [0, 0.1, 0], fov: 66},
	{t: 31.52, pos: [1.6, 1.0, 4.4], look: [0.3, 1.0, 0], fov: 34},
	{t: 34.37, pos: [1.6, 1.0, 4.4], look: [0.3, 1.0, 0], fov: 34},
	{t: 37.56, pos: [0, 3, 40], look: [0, 0.5, 0], fov: 75},
	{t: 37.58, pos: [0, 1, 9], look: [0, 0, 0], fov: 45},
	{t: 39.59, pos: [6, 1.5, 6], look: [0, 0, 0], fov: 42},
	{t: 40.76, pos: [1.3, 9.2, 2.6], look: [0, 0, 0], fov: 50},
	{t: 40.78, pos: [0, 2.6, 7], look: [0, 0, 0], fov: 45},
	{t: 43.1, pos: [0, 1.2, 3], look: [0, 0.6, 0], fov: 32},
	{t: 43.12, pos: [-4, 1.4, 4], look: [0, 0.4, 0], fov: 40},
	{t: 44.85, pos: [4, 1.4, 4], look: [0, 0.4, 0], fov: 40},
	{t: 46.36, pos: [2, 2.4, 8], look: [0, 0.4, 0], fov: 48},
	{t: 48.0, pos: [-2, 3, 9], look: [0, 0, 0], fov: 46},
	{t: 49.67, pos: [-6, 2.4, 6], look: [0, 0, 0], fov: 44},
	{t: 49.69, pos: [0, 0, 6], look: [0, 0, 0], fov: 42},
	{t: 54.61, pos: [0, 4, 16], look: [0, 1, 0], fov: 60},
	{t: 54.63, pos: [0, 0.4, 3], look: [0, 0.3, 0], fov: 30},
	{t: 58.05, pos: [0.4, 0.5, 1.8], look: [0.1, 0.35, 0], fov: 22},
	{t: 58.07, pos: [3, 1, 3], look: [0, 0.4, 0], fov: 40},
	{t: 59.2, pos: [0, 1.3, 4.2], look: [0, 0.4, 0], fov: 40},
	{t: 60.31, pos: [-3, 1, 3], look: [0, 0.4, 0], fov: 40},
	{t: 60.33, pos: [0, 1, 4], look: [0, 0.3, 0], fov: 38},
	{t: 61.44, pos: [0, 3, 30], look: [0, 0, 0], fov: 65},
	{t: 63.65, pos: [0, 5, 60], look: [0, 0, 0], fov: 75},
	{t: 63.67, pos: [0, 0, 10], look: [0, 0, 0], fov: 50},
	{t: 66.2, pos: [0, 0, 7], look: [0, 0, 0], fov: 46},
	{t: 66.768938, pos: [0, 0, 9], look: [0, 0, 0], fov: 50},
];

const camPX = track(CAM_POINTS.map((p) => [p.t, p.pos[0]] as Point));
const camPY = track(CAM_POINTS.map((p) => [p.t, p.pos[1]] as Point));
const camPZ = track(CAM_POINTS.map((p) => [p.t, p.pos[2]] as Point));
const camLX = track(CAM_POINTS.map((p) => [p.t, p.look[0]] as Point));
const camLY = track(CAM_POINTS.map((p) => [p.t, p.look[1]] as Point));
const camLZ = track(CAM_POINTS.map((p) => [p.t, p.look[2]] as Point));
const camFov = track(CAM_POINTS.map((p) => [p.t, p.fov] as Point));

// ---------------------------------------------------------------------------
// Object-level tracks
// ---------------------------------------------------------------------------

const stopwatchOpacityT = track([
	[0, 0], [0.3, 1],
	[5.34, 1], [6.5, 0],
	[54.61, 0], [54.9, 1],
	[58.05, 1], [59.0, 0],
	[65.9, 0], [66.5, 0.85],
	[66.768938, 0],
]);

const personOpacityT = track([
	[7.73, 0], [8.0, 1],
	[16.03, 1], [16.3, 0],
	[31.5, 0], [31.8, 1],
	[35.5, 1], [37.56, 0],
	[66.768938, 0],
]);

const personAgeT = track([
	[8.0, 0], [16.03, 0.5],
	[31.5, 0.5], [37.56, 1],
]);

// The whole-planet sphere is only shown when the camera is far enough out to
// see it as a globe (overBillionYears / continentsCanMove / earthUnrecognizable
// / butBillionYears). During the close-in terrain shots (mountains/species/
// disappear) the camera sits well inside the globe's radius, so the sphere is
// faded out there — otherwise it fills the whole frame edge-to-edge.
const earthOpacityT = track([
	[37.56, 0], [38.0, 1],
	[40.76, 1], [41.1, 0],
	[46.0, 0], [46.36, 1],
	[49.67, 1], [50.2, 0],
	[59.6, 0], [60.31, 1],
	[63.0, 0.3], [63.65, 0],
]);

const continentDriftT = track([
	[37.56, 0.05], [39.59, 0.15],
	[40.76, 0.55], [46.36, 0.6],
	[49.67, 1.0], [63.65, 1.0],
]);

const mountainHeightT = track([
	[40.76, 0.08], [41.9, 1.0], [43.1, 0.35],
]);

const speciesAmountT = track([
	[43.1, 0], [44.0, 1], [44.85, 1], [45.6, 0],
]);

const mountainsOpacityT = track([
	[40.76, 0], [41.1, 1], [43.1, 1], [43.5, 0],
]);

const speciesOpacityT = track([
	[43.1, 0], [43.4, 1], [46.0, 1], [46.36, 0],
]);

const iceAmountT = track([
	[46.36, 0], [47.5, 0.8], [48.6, 0.1], [49.67, 0.4],
]);

const particlesIntensityT = track([
	[0, 0.3], [16.03, 0.5], [17.54, 0.5], [24.58, 0.6],
	[29.94, 0.8], [31.5, 0.7], [37.56, 0.9], [49.67, 0.4],
	[61.44, 0.8], [66.768938, 0.35],
]);

export interface SceneState {
	camPos: [number, number, number];
	camLook: [number, number, number];
	camFov: number;
	stopwatchOpacity: number;
	personOpacity: number;
	personAge: number;
	earthOpacity: number;
	continentDrift: number;
	mountainHeight: number;
	mountainsOpacity: number;
	speciesAmount: number;
	speciesOpacity: number;
	iceAmount: number;
	particlesIntensity: number;
}

/** Tiny always-on handheld drift so nothing is ever a bit-for-bit frozen frame. */
const microSway = (frame: number, seed: number, amp: number) => {
	const t = frame / FPS;
	return Math.sin(t * 0.9 + seed) * amp + Math.sin(t * 2.3 + seed * 1.7) * amp * 0.4;
};

export const getSceneState = (frame: number): SceneState => ({
	camPos: [
		camPX(frame) + microSway(frame, 1, 0.03),
		camPY(frame) + microSway(frame, 2, 0.02),
		camPZ(frame) + microSway(frame, 3, 0.04),
	],
	camLook: [camLX(frame), camLY(frame), camLZ(frame)],
	camFov: camFov(frame),
	stopwatchOpacity: stopwatchOpacityT(frame),
	personOpacity: personOpacityT(frame),
	personAge: personAgeT(frame),
	earthOpacity: earthOpacityT(frame),
	continentDrift: continentDriftT(frame),
	mountainHeight: mountainHeightT(frame),
	mountainsOpacity: mountainsOpacityT(frame),
	speciesAmount: speciesAmountT(frame),
	speciesOpacity: speciesOpacityT(frame),
	iceAmount: iceAmountT(frame),
	particlesIntensity: particlesIntensityT(frame),
});
