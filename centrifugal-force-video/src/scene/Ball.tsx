// The ball: a bright emissive sphere + fresnel halo (same glow technique as
// the earlier quantum-particle video's Particle — reused here for visual
// continuity and because it reads clearly against a dark backdrop).
import React, {useMemo} from 'react';
import {makeHaloMaterial} from './shaders';
import type {V3} from './math';

export const Ball: React.FC<{
	position: V3;
	scale?: number;
	opacity?: number;
	color?: string;
	radius?: number;
}> = ({position, scale = 1, opacity = 1, color = '#ffd166', radius = 0.26}) => {
	const halo = useMemo(() => makeHaloMaterial(color, 1), [color]);
	halo.uniforms.uIntensity.value = 1.2 * opacity;

	return (
		<group position={position}>
			<mesh scale={scale * 2.4} material={halo}>
				<sphereGeometry args={[radius, 24, 24]} />
			</mesh>
			<mesh scale={scale}>
				<sphereGeometry args={[radius, 32, 32]} />
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={1.8}
					roughness={0.3}
					metalness={0.35}
					transparent
					opacity={opacity}
				/>
			</mesh>
		</group>
	);
};
