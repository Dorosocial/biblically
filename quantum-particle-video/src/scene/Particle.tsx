// The quantum particle: a single small glowing sphere with an additive halo
// behind it. Emissive material is the primary light source for this object —
// no HDRI, no scene lights required to read it in the dark backdrop.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {makeHaloMaterial} from './shaders';
import type {V3} from './math';

export const Particle: React.FC<{
	position: V3;
	scale?: number;
	opacity?: number;
	color?: string;
}> = ({position, scale = 1, opacity = 1, color = '#7ee8ff'}) => {
	const halo = useMemo(() => makeHaloMaterial(color, 1), [color]);
	halo.uniforms.uIntensity.value = 0.9 * opacity;

	return (
		<group position={position}>
			<mesh scale={scale * 2.6} material={halo}>
				<sphereGeometry args={[0.22, 24, 24]} />
			</mesh>
			<mesh scale={scale}>
				<sphereGeometry args={[0.22, 32, 32]} />
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={2.6}
					roughness={0.25}
					metalness={0.1}
					transparent
					opacity={opacity}
				/>
			</mesh>
		</group>
	);
};
