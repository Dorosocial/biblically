import React from 'react';

/** Simple flat floor plane — catches shadows/reflections for the bouncing-ball and
 * ball-at-rest shots. Dark, slightly glossy so impacts read with a soft highlight. */
export const Floor: React.FC<{
	readonly y?: number;
	readonly size?: number;
	readonly color?: string;
}> = ({y = 0, size = 40, color = '#1e2436'}) => {
	return (
		<mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
			<planeGeometry args={[size, size]} />
			<meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
		</mesh>
	);
};
