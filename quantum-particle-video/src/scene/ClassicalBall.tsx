// The classical analogy object: a plain opaque, matte sphere. Deliberately
// the visual opposite of Particle — no emissive glow, no halo, dull rough
// surface lit only by the scene's key/ambient lights — so "classical" vs
// "quantum" is obvious at a glance whenever the two share a frame.
import React from 'react';
import type {V3} from './math';

export const ClassicalBall: React.FC<{
	position: V3;
	scale?: number;
	opacity?: number;
	color?: string;
	ghost?: boolean; // faint, semi-transparent duplicate (for the "can't also be over there" beat)
}> = ({position, scale = 1, opacity = 1, color = '#f5985c', ghost = false}) => {
	return (
		<mesh position={position} scale={scale}>
			<sphereGeometry args={[0.32, 28, 28]} />
			{/* A warm emissive floor keeps the ball readable as a shape even from
			    angles the key light doesn't reach directly — it should never read
			    as pure black, just "not glowing" like the quantum particle. */}
			<meshStandardMaterial
				color={color}
				emissive="#5c2e10"
				emissiveIntensity={0.7}
				roughness={0.55}
				metalness={0.05}
				transparent
				opacity={ghost ? opacity * 0.35 : opacity}
			/>
		</mesh>
	);
};

// A red "X" drawn over the ghost duplicate — two crossed thin boxes, no
// emissive, reads as a diagram mark rather than a light source.
export const XMark: React.FC<{position: V3; scale?: number; opacity?: number}> = ({
	position,
	scale = 1,
	opacity = 1,
}) => {
	return (
		<group position={position} scale={scale} rotation={[0, 0, Math.PI / 4]}>
			<mesh>
				<boxGeometry args={[0.9, 0.12, 0.05]} />
				<meshBasicMaterial color="#ff4d4d" transparent opacity={opacity} />
			</mesh>
			<mesh rotation={[0, 0, Math.PI / 2]}>
				<boxGeometry args={[0.9, 0.12, 0.05]} />
				<meshBasicMaterial color="#ff4d4d" transparent opacity={opacity} />
			</mesh>
		</group>
	);
};
