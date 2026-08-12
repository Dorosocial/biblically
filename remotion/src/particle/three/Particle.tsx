import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FPS} from '../timing';
import {theme} from '../theme';

interface Props {
	position: [number, number, number];
	opacity: number;
	seed?: number;
}

/** The single glowing quantum particle — always exactly one, never duplicated. */
export const Particle: React.FC<Props> = ({position, opacity, seed = 0}) => {
	const frame = useCurrentFrame();
	const t = frame / FPS;
	const pulse = 1 + Math.sin(t * 3.2 + seed) * 0.12;

	if (opacity <= 0.001) return null;

	return (
		<group position={position}>
			<mesh scale={pulse}>
				<sphereGeometry args={[0.16, 24, 24]} />
				<meshStandardMaterial
					color={theme.particleGlow}
					emissive={theme.particleColor}
					emissiveIntensity={2.2}
					transparent
					opacity={opacity}
				/>
			</mesh>
			{/* soft halo */}
			<mesh scale={pulse * 2.1}>
				<sphereGeometry args={[0.16, 16, 16]} />
				<meshBasicMaterial color={theme.particleColor} transparent opacity={opacity * 0.16} depthWrite={false} />
			</mesh>
		</group>
	);
};
