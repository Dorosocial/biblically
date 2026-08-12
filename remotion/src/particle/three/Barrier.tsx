import React from 'react';
import {theme} from '../theme';

interface Props {
	opacity: number;
	position?: [number, number, number];
}

const THICK = 0.12;

/** A real barrier with two physical slit gaps (built from separate panel segments, not a texture cutout). */
export const Barrier: React.FC<Props> = ({opacity, position = [0, 0, 0]}) => {
	if (opacity <= 0.001) return null;

	const mat = (
		<meshStandardMaterial color={theme.barrierColor} emissive={theme.barrierLit} emissiveIntensity={0.45} transparent opacity={opacity} roughness={0.45} />
	);

	return (
		<group position={position}>
			{/* top segment, above both slits */}
			<mesh position={[0, 0.8, 0]}>
				<boxGeometry args={[3.2, 1.0, THICK]} />
				{mat}
			</mesh>
			{/* bottom segment, below both slits */}
			<mesh position={[0, -0.8, 0]}>
				<boxGeometry args={[3.2, 1.0, THICK]} />
				{mat}
			</mesh>
			{/* between the two slits */}
			<mesh position={[0, 0, 0]}>
				<boxGeometry args={[0.7, 0.6, THICK]} />
				{mat}
			</mesh>
			{/* left of the left slit */}
			<mesh position={[-1.15, 0, 0]}>
				<boxGeometry args={[0.9, 0.6, THICK]} />
				{mat}
			</mesh>
			{/* right of the right slit */}
			<mesh position={[1.15, 0, 0]}>
				<boxGeometry args={[0.9, 0.6, THICK]} />
				{mat}
			</mesh>
			{/* thin glow outline at each slit edge, for readability */}
			{[-0.5, 0.5].map((x) => (
				<React.Fragment key={x}>
					<mesh position={[x - 0.15, 0, 0.02]}>
						<boxGeometry args={[0.02, 0.62, 0.02]} />
						<meshStandardMaterial color={theme.barrierLit} emissive={theme.barrierLit} emissiveIntensity={0.7} transparent opacity={opacity} />
					</mesh>
					<mesh position={[x + 0.15, 0, 0.02]}>
						<boxGeometry args={[0.02, 0.62, 0.02]} />
						<meshStandardMaterial color={theme.barrierLit} emissive={theme.barrierLit} emissiveIntensity={0.7} transparent opacity={opacity} />
					</mesh>
				</React.Fragment>
			))}
		</group>
	);
};

export const SLIT_LEFT_X = -0.5;
export const SLIT_RIGHT_X = 0.5;
