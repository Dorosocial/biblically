// The glowing circular trail marking the ball's orbit. Also reused, with a
// partial `progress` reveal, to show the path "building up" as the rod keeps
// bending the ball's tangent into a circle (the bendingPathBuildup beat).
import React, {useMemo} from 'react';
import {makeRingMaterial} from './shaders';
import type {V3} from './math';

export const OrbitRing: React.FC<{
	pivot?: V3;
	radius: number;
	opacity?: number;
	progress?: number; // 0..1, how much of the ring is revealed
	rotationOffset?: number; // radians — where progress=0 starts
	color?: string;
	tube?: number;
}> = ({pivot = [0, 0, 0], radius, opacity = 1, progress = 1, rotationOffset = 0, color = '#5fd0ff', tube = 0.018}) => {
	const material = useMemo(() => makeRingMaterial(color), [color]);
	material.uniforms.uProgress.value = progress;
	material.uniforms.uOpacity.value = opacity;

	if (opacity <= 0.01 || progress <= 0.002) return null;

	// Two separate transforms, not one Euler triple: the inner mesh rotates
	// around the torus's own hole-axis (choosing which world angle maps to
	// vUv.x=0), THEN the outer group tilts that whole plane flat into the
	// world XZ orbit plane. Nesting composes unambiguously; a single
	// rotation=[x,y,z] prop would not (Euler order pitfalls).
	return (
		<group position={pivot} rotation={[Math.PI / 2, 0, 0]}>
			<mesh rotation={[0, 0, rotationOffset]} material={material}>
				<torusGeometry args={[radius, tube, 12, 128]} />
			</mesh>
		</group>
	);
};
