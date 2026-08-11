import React from 'react';
import {useThree} from '@react-three/fiber';

export type Vec3 = [number, number, number];

/**
 * Deterministic camera control for Remotion + R3F.
 *
 * We deliberately do NOT use R3F's `useFrame` (tied to requestAnimationFrame,
 * non-deterministic during server-side rendering). Instead every shot computes
 * a `position` / `lookAt` pair from `useCurrentFrame()` via `interpolate()`,
 * and this component applies it directly during React's render pass — which
 * Remotion drives frame-by-frame, so the camera is exactly reproducible on
 * every render worker.
 */
export const CameraRig: React.FC<{
	readonly position: Vec3;
	readonly lookAt: Vec3;
	readonly fov?: number;
}> = ({position, lookAt, fov = 45}) => {
	const {camera} = useThree();

	camera.position.set(position[0], position[1], position[2]);
	camera.up.set(0, 1, 0);
	camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
	if ('fov' in camera) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const cam = camera as any;
		cam.fov = fov;
		// A few shots put the camera within ~0.1 units of a surface for
		// "extreme close-up" framing — keep the near plane tiny so those
		// shots don't get clipped into a blank backdrop.
		cam.near = 0.01;
		cam.far = 100;
		cam.updateProjectionMatrix();
	}

	return null;
};

/** Orbit a point around a center on the XZ plane at a given height. */
export const orbitPosition = (
	center: Vec3,
	radius: number,
	angleRadians: number,
	height: number,
): Vec3 => [
	center[0] + Math.cos(angleRadians) * radius,
	height,
	center[2] + Math.sin(angleRadians) * radius,
];
