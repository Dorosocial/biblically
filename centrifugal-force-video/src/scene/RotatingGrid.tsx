// A faint radial grid that rotates WITH the rod — the visual signal that a
// shot is depicting the rotating reference frame (as opposed to the fixed
// outside frame, which shows no such grid). Used for the rotating-frame
// replay, the centrifugal beats, and the split-screen contrast.
import React, {useMemo} from 'react';
import type {V3} from './math';

export const RotatingGrid: React.FC<{
	pivot?: V3;
	angle: number;
	radius: number;
	opacity?: number;
	spokes?: number;
	color?: string;
}> = ({pivot = [0, 0, 0], angle, radius, opacity = 1, spokes = 8, color = '#7a8fd6'}) => {
	const offsets = useMemo(() => new Array(spokes).fill(0).map((_, i) => (i / spokes) * Math.PI * 2), [spokes]);

	if (opacity <= 0.01) return null;

	return (
		<group position={pivot} rotation={[0, angle, 0]}>
			{offsets.map((off, i) => (
				<mesh key={i} position={[Math.cos(off) * (radius / 2), 0, Math.sin(off) * (radius / 2)]} rotation={[0, Math.PI / 2 - off, 0]}>
					<boxGeometry args={[0.012, 0.012, radius]} />
					<meshBasicMaterial color={color} transparent opacity={opacity * 0.55} />
				</mesh>
			))}
			<mesh rotation={[Math.PI / 2, 0, 0]}>
				<ringGeometry args={[radius * 0.985, radius * 1.0, 64]} />
				<meshBasicMaterial color={color} transparent opacity={opacity * 0.4} side={2} />
			</mesh>
		</group>
	);
};
