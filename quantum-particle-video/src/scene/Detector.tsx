// A "which-path" detector: a small emissive marker beside a slit that lights
// up distinctly when it "measures" the particle passing through.
import React from 'react';
import type {V3} from './math';

export const Detector: React.FC<{
	position: V3;
	active?: number; // 0..1
	opacity?: number;
	color?: string;
}> = ({position, active = 0, opacity = 1, color = '#ff9f5a'}) => {
	if (opacity <= 0.01) return null;
	return (
		<mesh position={position} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
			<octahedronGeometry args={[0.16, 2]} />
			<meshStandardMaterial
				color={color}
				emissive={color}
				emissiveIntensity={0.5 + active * 1.6}
				roughness={0.35}
				metalness={0.4}
				transparent
				opacity={opacity}
			/>
		</mesh>
	);
};
