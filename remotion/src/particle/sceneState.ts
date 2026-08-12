import {interpolate} from 'remotion';
import {FPS} from './timing';

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
// CAMERA — one continuous move for the whole 72.8s film. The very last point
// matches the very first point exactly (pos [0,0,7], look [0,0,3], fov 45)
// so the loop's freeze-release match-cuts with zero pop.
// ---------------------------------------------------------------------------

const CAM_POINTS: {t: number; pos: [number, number, number]; look: [number, number, number]; fov: number}[] = [
	{t: 0.0, pos: [0, 0, 7], look: [0, 0, 3], fov: 45},
	{t: 1.2, pos: [0, 0, 4], look: [0, 0, 3], fov: 32},
	{t: 3.13, pos: [0, 1.0, 10], look: [0, 0, 3], fov: 55},
	{t: 4.52, pos: [0, 1.0, 9.6], look: [0, 0, 3], fov: 54},
	{t: 4.54, pos: [-1.6, 0.4, 6.5], look: [-1.6, 0, 3], fov: 38},
	{t: 6.34, pos: [-1.5, 0.5, 6.3], look: [-1.6, 0, 3], fov: 38},
	{t: 6.36, pos: [-1.6, 0.4, 6.5], look: [-1.6, 0, 3], fov: 38},
	{t: 7.91, pos: [1.6, 0.4, 6.5], look: [1.6, 0, 3], fov: 38},
	{t: 7.93, pos: [1.2, 0.5, 5.5], look: [0, 0, 3], fov: 40},
	{t: 9.3, pos: [-2.5, 0.6, 3.0], look: [0, 0, 3], fov: 40},
	{t: 10.71, pos: [0, 0.6, -1.5], look: [0, 0, 3], fov: 40},
	{t: 10.73, pos: [0, 3.0, 2], look: [0, 0, 0], fov: 48},
	{t: 11.5, pos: [0, 3.8, 8], look: [0, 0, -1], fov: 52},
	{t: 11.52, pos: [0.6, 1.0, 7], look: [0, 0, 3], fov: 42},
	{t: 16.69, pos: [0.3, 0.6, 2.2], look: [0, 0, 0.5], fov: 36},
	{t: 16.71, pos: [0.2, 0.4, 1.6], look: [0, 0, 0], fov: 34},
	{t: 18.07, pos: [0, 0.3, 0.7], look: [0, 0, 0], fov: 28},
	{t: 18.09, pos: [0, 0.8, 6], look: [0, 0, 2], fov: 42},
	{t: 21.29, pos: [0, 0.6, 1.2], look: [0, 0, 0], fov: 34},
	{t: 21.31, pos: [-1.4, 0.6, 3], look: [-0.5, 0, 0], fov: 38},
	{t: 24.32, pos: [1.4, 0.6, 3], look: [0.5, 0, 0], fov: 38},
	// This whole crossing is routed through the right slit's actual opening
	// (x=0.5, y~0.05, well inside the -0.3..0.3 gap) so the camera never
	// clips through the solid barrier panels while it travels through z=0.
	{t: 24.34, pos: [0.5, 0.05, 1.5], look: [0.5, 0, -1], fov: 36},
	{t: 26.59, pos: [0.3, 0.1, -1.0], look: [0, 0, -4], fov: 42},
	{t: 26.61, pos: [0.15, 0.15, -1.1], look: [0, 0, -4], fov: 42},
	{t: 28.7, pos: [0, 0.2, -1.6], look: [0, 0, -4], fov: 40},
	// same trick for the second barrier crossing, this time through the left slit.
	{t: 28.72, pos: [-0.5, 0.05, 0.5], look: [-0.3, 0, -1], fov: 40},
	{t: 30.3, pos: [-0.4, 0.3, -0.6], look: [0, 0, -2], fov: 42},
	{t: 32.02, pos: [0.4, 1.0, -1.0], look: [0, 0, -2.5], fov: 42},
	{t: 32.04, pos: [0.7, 0.9, 0.3], look: [0, 0.2, -1.8], fov: 46},
	{t: 34.53, pos: [0.6, 0.7, -1.2], look: [0, 0.1, -2.8], fov: 36},
	// trails just behind the particle's own path (z: -1 -> -3.6) so it never
	// looks past/behind the thing it's supposed to be tracking.
	{t: 34.55, pos: [0.5, 0.3, 0.0], look: [0.25, 0, -1.0], fov: 36},
	{t: 37.39, pos: [0.1, 0.15, -3.0], look: [0.3, 0, -3.6], fov: 22},
	{t: 37.41, pos: [0, 0.4, -1], look: [0, 0, -3], fov: 38},
	// clears back over the top of the barrier (barrier top edge is y=1.3) so
	// this long crossing never clips through the barrier panels.
	{t: 39.08, pos: [0.9, 1.6, 0], look: [0.5, 0.5, -1], fov: 44},
	{t: 42.41, pos: [2.0, 1.2, 2], look: [0, 0, -1], fov: 50},
	{t: 42.43, pos: [1.6, 1.4, 4], look: [0, 0, -1], fov: 52},
	{t: 44.86, pos: [0, 2.4, 9], look: [0, 0, -1.5], fov: 58},
	{t: 44.88, pos: [0, 1.2, 5], look: [0, 0, 0.3], fov: 44},
	{t: 48.3, pos: [0.6, 0.5, 1.3], look: [0.5, 0, 0.2], fov: 30},
	{t: 48.32, pos: [0.65, 0.4, 0.9], look: [0.5, 0.1, 0.3], fov: 20},
	{t: 49.1, pos: [0.55, 0.35, 0.7], look: [0.5, 0.1, 0.3], fov: 18},
	{t: 49.12, pos: [0.3, 0.3, -1.5], look: [0, 0, -4], fov: 30},
	{t: 51.42, pos: [0, 0.2, -3.4], look: [0, 0, -4], fov: 30},
	// look targets match the particle's actual landing spot (0.5,0,-3.6), and
	// the close end point keeps enough distance to avoid overshooting past it.
	{t: 51.44, pos: [0.45, 0.25, -3.0], look: [0.5, 0, -3.6], fov: 30},
	{t: 53.9, pos: [0.5, 0.25, -2.9], look: [0.5, 0, -3.6], fov: 26},
	// wide enough (and far enough back) to keep both the ball (x~-1.6..-2.2)
	// and the ghost duplicate (x=1.6) inside frame at once — verified with
	// scripts/checkframe.mjs against the portrait (9:16) frustum.
	{t: 53.92, pos: [0, 0.7, 10], look: [0, 0, 3], fov: 64},
	{t: 59.47, pos: [0, 1.0, 13], look: [0, 0, 3], fov: 66},
	{t: 59.49, pos: [2.4, 0.6, 3], look: [0, 0, 3], fov: 40},
	{t: 61.05, pos: [-2.4, 0.8, 3], look: [0, 0, 3], fov: 40},
	{t: 61.07, pos: [0, 0.6, 6], look: [0, 0, 3], fov: 42},
	{t: 62.22, pos: [0, 0.4, 2], look: [0, 0, 3], fov: 36},
	{t: 62.24, pos: [0.2, 0.9, 7], look: [0, 0, 2], fov: 48},
	{t: 65.82, pos: [-0.2, 1.0, 6.6], look: [0, 0, 2], fov: 48},
	// wide + far back enough that both the classical ball (x=-2.2) and the
	// quantum wave (x=2.2) stay in frame through the whole pan.
	{t: 65.84, pos: [-1.0, 0.7, 9], look: [-1.5, 0, 3], fov: 68},
	{t: 69.55, pos: [1.0, 0.7, 9], look: [1.5, 0, 3], fov: 68},
	{t: 69.57, pos: [0, 0.5, 9], look: [0, 0, 3], fov: 50},
	{t: 71.22, pos: [0, 0.02, 3.3], look: [0, 0, 3], fov: 8},
	{t: 71.24, pos: [0, 0.3, 5], look: [0, 0, 3], fov: 30},
	{t: 72.2, pos: [0, 0.1, 3.6], look: [0, 0, 3], fov: 16},
	{t: 72.5, pos: [0, 0.05, 3.5], look: [0, 0, 3], fov: 14},
	{t: 72.80325, pos: [0, 0, 7], look: [0, 0, 3], fov: 45},
];

const camPX = track(CAM_POINTS.map((p) => [p.t, p.pos[0]] as Point));
const camPY = track(CAM_POINTS.map((p) => [p.t, p.pos[1]] as Point));
const camPZ = track(CAM_POINTS.map((p) => [p.t, p.pos[2]] as Point));
const camLX = track(CAM_POINTS.map((p) => [p.t, p.look[0]] as Point));
const camLY = track(CAM_POINTS.map((p) => [p.t, p.look[1]] as Point));
const camLZ = track(CAM_POINTS.map((p) => [p.t, p.look[2]] as Point));
const camFov = track(CAM_POINTS.map((p) => [p.t, p.fov] as Point));

// ---------------------------------------------------------------------------
// Particle (the single glowing quantum particle / classical-analogy stand-in)
// ---------------------------------------------------------------------------

const particleOpacityT = track([
	[0, 1], [3.13, 1], [4.52, 0],
	[7.91, 0], [7.93, 0.15], [10.71, 1],
	[16.69, 1], [18.07, 1], [21.29, 1], [24.32, 1], [26.59, 0.15],
	[28.7, 0.15], [32.02, 0],
	[34.53, 0], [34.7, 1], [37.39, 1], [37.41, 1], [39.5, 0],
	[42.41, 0], [49.1, 0], [51.42, 0], [51.6, 1], [53.9, 1], [54.3, 0],
	[59.47, 0], [65.82, 0], [69.55, 0], [69.57, 0], [70.0, 1], [71.22, 1],
	[71.24, 1], [71.5, 0], [71.9, 0], [72.2, 0], [72.35, 1], [72.5, 1],
	[72.80325, 1],
]);

const particlePosXT = track([
	[0, 0], [18.09, 0], [51.6, 0.5], [53.9, 0.5], [54.3, -1.6], [69.57, 0],
	// held exactly at 0 through the becauseAtThatScale dive (whose extremely
	// tight fov leaves no margin for drift) — only starts moving to its final
	// detection-point x once the montage itself begins.
	[71.22, 0], [72.2, 0.4], [72.5, 0.4], [72.80325, 0],
]);

const particlePosZT = track([
	[0, 3], [10.71, 3], [11.5, 4], [16.69, 0.3], [18.07, 0.1], [18.09, 4],
	[21.29, 0.1], [24.32, 0.1], [26.59, -1], [34.53, -1], [34.7, -1],
	[37.39, -3.6], [37.41, -3.6], [51.6, -3.6], [53.9, -3.6], [54.3, 3],
	[69.57, 3], [71.22, 3], [72.2, -2], [72.5, -2], [72.80325, 3],
]);

// ---------------------------------------------------------------------------
// Classical ball / ghosted duplicate (the "one object, one place" analogy)
// ---------------------------------------------------------------------------

const ballOpacityT = track([
	[0, 0], [4.52, 0], [4.7, 1], [7.91, 1], [7.93, 1], [8.3, 0],
	[10.71, 0], [21.29, 0], [21.5, 1], [24.32, 1], [24.6, 0],
	[26.59, 0], [53.9, 0], [54.1, 1], [59.47, 1], [59.49, 1], [59.8, 0],
	[65.82, 0], [66.1, 1], [69.55, 1], [69.7, 0], [72.80325, 0],
]);

const ballPosXT = track([
	[0, -1.6], [21.29, 0], [24.32, -0.5], [53.9, -1.6], [65.82, -2.2], [72.80325, -1.6],
]);

const ballPosZT = track([
	[0, 3], [21.29, 4], [24.32, -0.5], [53.9, 3], [65.82, 3], [72.80325, 3],
]);

const ghostOpacityT = track([
	[0, 0], [6.34, 0], [6.5, 1], [7.91, 1], [7.93, 1], [8.3, 0],
	[10.71, 0], [53.9, 0], [54.1, 1], [57.0, 1], [59.47, 0], [72.80325, 0],
]);

// ---------------------------------------------------------------------------
// Apparatus (barrier + screen + detectors group)
// ---------------------------------------------------------------------------

const apparatusOpacityT = track([
	[0, 0], [10.71, 0], [10.73, 0], [11.3, 1], [53.9, 1], [54.3, 0],
	[62.22, 0], [62.5, 1], [65.82, 1], [66.1, 0],
	[71.22, 0], [71.4, 1], [72.5, 1], [72.7, 0], [72.80325, 0],
]);

// ---------------------------------------------------------------------------
// Wavefunction / probability field — NEVER two duplicate particle-balls.
// waveSpread: 0 = collapsed to a point, 1 = fully extended (through both
// slits, or as a wide "cloud" depending on which shot is active).
// ---------------------------------------------------------------------------

const waveOpacityT = track([
	[0, 0], [10.71, 0], [11.52, 0], [12.5, 0.5], [16.69, 0.7], [18.07, 0.7],
	[18.5, 0.3], [21.29, 0.3], [24.32, 0.3], [24.6, 0.9], [26.59, 0.9],
	[28.7, 0.9], [32.02, 0.9], [33.0, 0.5], [34.53, 0.5], [34.7, 0.0],
	[37.39, 0.0], [37.41, 0.0], [39.0, 0.9], [42.41, 0.9], [44.86, 0.9],
	[48.3, 0.9], [48.5, 0.9], [49.0, 0.3], [49.1, 0.3], [51.42, 0.3],
	[51.6, 0.0], [53.9, 0.0], [59.47, 0.0], [59.8, 0.8], [61.05, 0.8],
	[62.22, 0.9], [65.82, 0.9], [69.55, 0.9], [69.8, 0.0], [71.22, 0.0],
	[71.24, 0.0], [71.5, 0.9], [71.9, 0.9], [72.2, 0.0], [72.5, 0.0],
	[72.80325, 0.0],
]);

const waveSpreadT = track([
	[0, 0], [11.52, 0.1], [16.69, 0.5], [18.07, 0.3], [21.29, 0.3],
	[24.32, 0.5], [26.59, 0.9], [32.02, 0.9], [33.0, 0.35], [33.6, 0.9],
	[34.2, 0.4], [34.53, 0.6], [37.41, 0.2], [39.0, 0.7], [42.41, 0.85],
	[44.86, 0.95], [48.3, 0.95], [49.0, 0.3], [51.6, 0.15], [59.8, 0.6],
	[61.05, 0.75], [62.22, 0.9], [65.82, 0.9], [69.55, 0.9], [69.8, 0.2],
	[71.22, 0.1], [71.5, 0.85], [71.9, 0.85], [72.2, 0.15], [72.80325, 0.0],
]);

const waveLobeBiasT = track([
	[0, 0], [48.3, 0], [48.7, -1], [51.42, -1], [51.6, 0], [72.80325, 0],
]);

// ---------------------------------------------------------------------------
// Detection screen pattern
// ---------------------------------------------------------------------------

const screenInterferenceAmountT = track([
	[0, 0], [26.59, 0], [28.7, 1], [48.3, 1], [49.1, 1], [53.9, 1], [54.3, 0],
	[62.22, 0], [62.5, 1], [65.82, 1], [66.0, 0],
	[71.22, 0], [71.35, 1], [72.0, 1], [72.2, 1], [72.5, 0.6], [72.80325, 0],
]);

const screenCollapseMixT = track([
	[0, 0], [26.59, 0], [48.3, 0], [49.1, 0], [51.22, 1], [51.42, 1],
	[62.22, 1], [62.4, 0], [65.82, 0], [66.0, 1],
	[71.22, 1], [72.80325, 1],
]);

// ---------------------------------------------------------------------------
// Path detectors ("WHICH PATH?")
// ---------------------------------------------------------------------------

const detectorOpacityT = track([
	[0, 0], [44.86, 0], [45.3, 1], [48.3, 1], [53.9, 1], [54.2, 0],
	[71.22, 0], [71.35, 1], [72.5, 1], [72.7, 0], [72.80325, 0],
]);

const detectorGlowT = track([
	[0, 0], [48.3, 0], [48.7, 1], [49.1, 1], [51.42, 0.6], [53.9, 0.6],
	[54.2, 0], [71.22, 0], [71.35, 0.8], [72.5, 0.8], [72.7, 0], [72.80325, 0],
]);

const detectorActiveSideT = track([
	[0, 0], [48.3, 0], [48.7, -1], [72.80325, -1],
]);

const particlesIntensityT = track([
	[0, 0.3], [3.13, 0.5], [4.52, 0.5], [10.71, 0.4], [11.5, 0.35],
	[26.59, 0.5], [32.02, 0.6], [37.39, 0.4], [44.86, 0.6], [53.9, 0.4],
	[61.05, 0.55], [69.55, 0.7], [71.22, 0.8], [72.80325, 0.3],
]);

export interface SceneState {
	camPos: [number, number, number];
	camLook: [number, number, number];
	camFov: number;
	particleOpacity: number;
	particlePos: [number, number, number];
	ballOpacity: number;
	ballPos: [number, number, number];
	ghostOpacity: number;
	apparatusOpacity: number;
	waveOpacity: number;
	waveSpread: number;
	waveLobeBias: number;
	screenInterferenceAmount: number;
	screenCollapseMix: number;
	detectorOpacity: number;
	detectorGlow: number;
	detectorActiveSide: number;
	particlesIntensity: number;
}

const microSway = (frame: number, seed: number, amp: number) => {
	const t = frame / FPS;
	return Math.sin(t * 0.9 + seed) * amp + Math.sin(t * 2.3 + seed * 1.7) * amp * 0.4;
};

export const getSceneState = (frame: number): SceneState => ({
	camPos: [
		camPX(frame) + microSway(frame, 1, 0.025),
		camPY(frame) + microSway(frame, 2, 0.018),
		camPZ(frame) + microSway(frame, 3, 0.03),
	],
	camLook: [camLX(frame), camLY(frame), camLZ(frame)],
	camFov: camFov(frame),
	particleOpacity: particleOpacityT(frame),
	particlePos: [particlePosXT(frame), 0, particlePosZT(frame)],
	ballOpacity: ballOpacityT(frame),
	ballPos: [ballPosXT(frame), 0, ballPosZT(frame)],
	ghostOpacity: ghostOpacityT(frame),
	apparatusOpacity: apparatusOpacityT(frame),
	waveOpacity: waveOpacityT(frame),
	waveSpread: waveSpreadT(frame),
	waveLobeBias: waveLobeBiasT(frame),
	screenInterferenceAmount: screenInterferenceAmountT(frame),
	screenCollapseMix: screenCollapseMixT(frame),
	detectorOpacity: detectorOpacityT(frame),
	detectorGlow: detectorGlowT(frame),
	detectorActiveSide: detectorActiveSideT(frame),
	particlesIntensity: particlesIntensityT(frame),
});
