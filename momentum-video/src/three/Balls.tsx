import React, {useMemo, useRef} from 'react';
import {useCurrentFrame} from 'remotion';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Shared idle-motion helpers.
//
// CONSTANT MOTION RULE: the balls must never sit perfectly static except at
// the explicitly scripted freeze-frame beats. Every ball gets a continuous
// roll + a faint scale "breathing" pulse layered under whatever the shot's
// scripted motion is doing, unless `frozen` is passed.
// ---------------------------------------------------------------------------

export const idleRoll = (frame: number, speed: number, seed: number) =>
	frame * speed + seed;

export const idlePulse = (frame: number, seed: number) =>
	1 + Math.sin(frame / 9 + seed) * 0.012;

export type BallHandle = THREE.Group | null;

export const GIANT_RADIUS = 1.6;
export const TINY_RADIUS = 0.42;

export const GiantBall: React.FC<{
	position: [number, number, number];
	rotationSeed?: number;
	frozen?: boolean;
	scaleMul?: number;
}> = ({position, rotationSeed = 0, frozen = false, scaleMul = 1}) => {
	const frame = useCurrentFrame();
	const roll = frozen ? rotationSeed : idleRoll(frame, 0.01, rotationSeed);
	const pulse = frozen ? 1 : idlePulse(frame, rotationSeed);

	return (
		<group position={position}>
			<mesh rotation={[roll * 0.6, roll, 0]} scale={pulse * scaleMul}>
				<sphereGeometry args={[GIANT_RADIUS, 32, 32]} />
				<meshStandardMaterial
					color="#454e63"
					metalness={0.85}
					roughness={0.35}
					envMapIntensity={1.2}
				/>
			</mesh>
			{/* subtle rim mesh for extra dark-metal specular pop, no HDRI needed */}
			<mesh rotation={[roll * 0.6, roll, 0]} scale={pulse * scaleMul * 1.001}>
				<sphereGeometry args={[GIANT_RADIUS, 32, 32]} />
				<meshStandardMaterial
					color="#000000"
					metalness={1}
					roughness={0.05}
					transparent
					opacity={0.15}
					side={THREE.BackSide}
				/>
			</mesh>
		</group>
	);
};

export const TinyBall: React.FC<{
	position: [number, number, number];
	rotationSeed?: number;
	frozen?: boolean;
	glow?: number;
	scaleMul?: number;
}> = ({position, rotationSeed = 3, frozen = false, glow = 1, scaleMul = 1}) => {
	const frame = useCurrentFrame();
	const roll = frozen ? rotationSeed : idleRoll(frame, 0.08, rotationSeed);
	const pulse = frozen ? 1 : idlePulse(frame, rotationSeed + 1.7);

	return (
		<group position={position}>
			<mesh rotation={[roll * 0.4, roll, roll * 0.2]} scale={pulse * scaleMul}>
				<sphereGeometry args={[TINY_RADIUS, 28, 28]} />
				<meshStandardMaterial
					color="#f4d35e"
					metalness={0.85}
					roughness={0.15}
					emissive="#ffb703"
					emissiveIntensity={0.55 * glow}
				/>
			</mesh>
			<pointLight
				color="#ffcf5c"
				intensity={2.2 * glow}
				distance={4.5}
				decay={2}
			/>
		</group>
	);
};
