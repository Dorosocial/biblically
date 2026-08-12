// =============================================================================
// RodBallRig — the reusable rig: a metal rod pivoting around one end, a ball
// at the far end. This is the component the brief asks to reuse from "the
// earlier ball-on-rotating-rod video"; no such prior project exists in this
// repository's history, so it's built fresh here — but deliberately isolated
// and parameterized (pivot position, rod length/visibility, ball position
// independent of the rod's geometry) so a future physics-montage video can
// import this file directly instead of rebuilding it again.
// =============================================================================
import React from 'react';
import * as THREE from 'three';
import {Ball} from './Ball';
import type {V3} from './math';

const UP = new THREE.Vector3(0, 1, 0);

export const RodBallRig: React.FC<{
	pivot?: V3;
	ballPosition: V3;
	rodVisible: boolean;
	ballOpacity?: number;
	ballScale?: number;
	ballColor?: string;
	rodColor?: string;
	rodOpacity?: number;
	rodRadius?: number;
	pivotVisible?: boolean;
}> = ({
	pivot = [0, 0, 0],
	ballPosition,
	rodVisible,
	ballOpacity = 1,
	ballScale = 1,
	ballColor = '#ffd166',
	rodColor = '#9aa4bd',
	rodOpacity = 1,
	rodRadius = 0.055,
	pivotVisible = true,
}) => {
	const p = new THREE.Vector3(...pivot);
	const b = new THREE.Vector3(...ballPosition);
	const diff = b.clone().sub(p);
	const len = diff.length();
	const quaternion =
		len > 0.0001 ? new THREE.Quaternion().setFromUnitVectors(UP, diff.clone().normalize()) : new THREE.Quaternion();
	const mid = p.clone().add(b).multiplyScalar(0.5);

	return (
		<>
			{pivotVisible && (
				<mesh position={pivot}>
					<cylinderGeometry args={[0.14, 0.14, 0.16, 20]} />
					<meshStandardMaterial color="#3a3f52" emissive="#20263c" emissiveIntensity={0.6} roughness={0.5} metalness={0.5} />
				</mesh>
			)}
			{rodVisible && len > 0.001 && (
				<mesh position={mid} quaternion={new THREE.Quaternion().setFromUnitVectors(UP, diff.clone().normalize())}>
					<cylinderGeometry args={[rodRadius, rodRadius, len, 16]} />
					<meshStandardMaterial
						color={rodColor}
						emissive="#4a5170"
						emissiveIntensity={0.5}
						roughness={0.35}
						metalness={0.7}
						transparent
						opacity={rodOpacity}
					/>
				</mesh>
			)}
			<Ball position={ballPosition} opacity={ballOpacity} scale={ballScale} color={ballColor} />
		</>
	);
};

/** Position on a horizontal (XZ) circle of given radius/height around a pivot, at angle (radians). */
export const circlePos = (pivot: V3, radius: number, angle: number, height = 0): V3 => [
	pivot[0] + Math.cos(angle) * radius,
	pivot[1] + height,
	pivot[2] + Math.sin(angle) * radius,
];

/** Tangent (velocity) direction for counter-clockwise motion on the XZ circle at `angle`. */
export const tangentDir = (angle: number): V3 => [-Math.sin(angle), 0, Math.cos(angle)];

/** Inward (radial, toward pivot) direction at `angle`. */
export const inwardDir = (angle: number): V3 => [-Math.cos(angle), 0, -Math.sin(angle)];

/** Outward (radial, away from pivot) direction at `angle` — only ever drawn in rotating-frame shots. */
export const outwardDir = (angle: number): V3 => [Math.cos(angle), 0, Math.sin(angle)];

/** Rotate a vector around the world Y axis by `angle` radians — the core of the
 * reused "rotating-frame camera" technique: compute a camera offset in the
 * rod's local frame, then rotate it by the rod's current angle to get the
 * world-space camera pose for this frame. */
export const rotateY = (v: V3, angle: number): V3 => {
	const c = Math.cos(angle);
	const s = Math.sin(angle);
	// Sign convention matched to circlePos: rotateY([1,0,0], a) === (cos a, 0, sin a).
	// (An earlier version had this backwards, which made the rotating-frame
	// camera spin the opposite way from the ball — they'd drift in and out
	// of alignment instead of staying locked together.)
	return [v[0] * c - v[2] * s, v[1], v[0] * s + v[2] * c];
};

export const addV3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const scaleV3 = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
