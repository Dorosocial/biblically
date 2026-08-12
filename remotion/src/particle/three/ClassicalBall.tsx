import React from 'react';
import {theme} from '../theme';

interface BallProps {
	position: [number, number, number];
	opacity: number;
}

/** Opaque, matte classical ball — deliberately visually distinct from the glowing particle. */
export const ClassicalBall: React.FC<BallProps> = ({position, opacity}) => {
	if (opacity <= 0.001) return null;
	return (
		<mesh position={position}>
			<sphereGeometry args={[0.3, 28, 28]} />
			<meshStandardMaterial
				color={theme.classicalBall}
				emissive={theme.classicalBallDim}
				emissiveIntensity={0.4}
				transparent
				opacity={opacity}
				roughness={0.5}
				metalness={0.15}
			/>
		</mesh>
	);
};

interface GhostProps {
	position: [number, number, number];
	opacity: number;
}

/** Ghosted duplicate ball with an X through it — "it can't also be over there." */
export const GhostBall: React.FC<GhostProps> = ({position, opacity}) => {
	if (opacity <= 0.001) return null;
	return (
		<group position={position}>
			<mesh>
				<sphereGeometry args={[0.3, 24, 24]} />
				<meshStandardMaterial color={theme.ghostBall} transparent opacity={opacity * 0.35} roughness={0.6} />
			</mesh>
			<group rotation={[0, 0, Math.PI / 4]}>
				<mesh>
					<boxGeometry args={[0.75, 0.07, 0.07]} />
					<meshStandardMaterial color={theme.ghostBall} emissive={theme.ghostBall} emissiveIntensity={0.8} transparent opacity={opacity} />
				</mesh>
				<mesh rotation={[0, 0, Math.PI / 2]}>
					<boxGeometry args={[0.75, 0.07, 0.07]} />
					<meshStandardMaterial color={theme.ghostBall} emissive={theme.ghostBall} emissiveIntensity={0.8} transparent opacity={opacity} />
				</mesh>
			</group>
		</group>
	);
};
