import {interpolate, spring} from 'remotion';
import {FPS} from './timing';

/**
 * Standard "climbing/sliding into place" entrance: text rises + fades in
 * with a springy settle, rather than a static pop-in.
 */
export const climbIn = (frame: number, startFrame: number, durationInFrames = 18) => {
	const local = frame - startFrame;
	const p = spring({frame: local, fps: FPS, config: {damping: 16, mass: 0.6}, durationInFrames});
	const opacity = interpolate(local, [0, durationInFrames * 0.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const translateY = interpolate(p, [0, 1], [26, 0]);
	const scale = interpolate(p, [0, 1], [0.92, 1]);
	return {opacity, translateY, scale};
};

/** Gentle continuous pulse — used to keep "held" numbers/text feeling alive. */
export const pulse = (frame: number, seed = 0, speed = 1.6, amount = 0.035) => {
	const t = frame / FPS;
	return 1 + Math.sin(t * speed + seed) * amount;
};

/** Glow intensity breathing, paired with `pulse` for text-shadow strength. */
export const glowPulse = (frame: number, seed = 0, speed = 1.6) => {
	const t = frame / FPS;
	return 0.6 + (Math.sin(t * speed + seed) * 0.5 + 0.5) * 0.5;
};

export const slideIn = (frame: number, startFrame: number, fromX: number, durationInFrames = 16) => {
	const local = frame - startFrame;
	const p = spring({frame: local, fps: FPS, config: {damping: 18, mass: 0.5}, durationInFrames});
	const opacity = interpolate(local, [0, durationInFrames * 0.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const translateX = interpolate(p, [0, 1], [fromX, 0]);
	return {opacity, translateX};
};

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
