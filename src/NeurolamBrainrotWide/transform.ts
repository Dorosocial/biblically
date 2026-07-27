import {interpolate} from 'remotion';
import {DistractorSpec} from '../NeurolamBrainrot/types';
import {CENTER_X, CENTER_Y} from './constants';

export interface ResolvedTransform {
	x: number;
	y: number;
	opacity: number;
	scale: number;
	rotation: number;
	t: number;
}

export const resolveTransform = (
	spec: DistractorSpec,
	frame: number
): ResolvedTransform => {
	const t = Math.min(1, Math.max(0, (frame - spec.startFrame) / spec.duration));

	const envelope = interpolate(t, [0, 0.18, 0.82, 1], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacity = envelope * spec.intensity;

	let x = spec.fromX;
	let y = spec.fromY;
	let scale = 1;

	if (spec.motion === 'static') {
		scale = interpolate(t, [0, 0.3, 0.7, 1], [0.55, 1, 1, 0.65], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
	} else if (spec.motion === 'linear') {
		x = interpolate(t, [0, 1], [spec.fromX, spec.toX], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
		y = interpolate(t, [0, 1], [spec.fromY, spec.toY], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
	} else {
		const angle = spec.orbitAngle + spec.spin * t;
		const rad = (angle * Math.PI) / 180;
		x = CENTER_X + Math.cos(rad) * spec.orbitRadius;
		y = CENTER_Y + Math.sin(rad) * spec.orbitRadius * 0.8;
	}

	const rotation = spec.rotation + spec.spin * t;

	return {x, y, opacity, scale, rotation, t};
};
