import React from 'react';
import {Html} from '@react-three/drei';

/**
 * Vertical glowing energy bar + numeric value beside it (Energy concept's
 * visual identity). `fill` is 0..1. The bar glows via emissive material —
 * no post-processing bloom pass, so intensity does the work.
 */
export const EnergyBar: React.FC<{
	readonly position: [number, number, number];
	readonly fill: number; // 0..1
	readonly color: string;
	readonly label: string;
	readonly maxHeight?: number;
	readonly width?: number;
}> = ({position, fill, color, label, maxHeight = 2.6, width = 0.34}) => {
	const clamped = Math.max(0.02, Math.min(1, fill));
	const height = clamped * maxHeight;
	const displayValue = Math.round(clamped * 100);

	return (
		<group position={position}>
			{/* Track (dim background bar) */}
			<mesh position={[0, maxHeight / 2, 0]}>
				<boxGeometry args={[width, maxHeight, width * 0.6]} />
				<meshStandardMaterial color="#1a1d26" roughness={0.9} />
			</mesh>

			{/* Fill (glowing) */}
			<mesh position={[0, height / 2, 0.01]}>
				<boxGeometry args={[width * 1.02, height, width * 0.66]} />
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={2.4}
					toneMapped={false}
				/>
			</mesh>

			<Html
				position={[0, height + 0.32, 0]}
				center
				transform={false}
				style={{pointerEvents: 'none'}}
			>
				<div
					style={{
						fontFamily: '"Helvetica Neue", Arial, sans-serif',
						fontWeight: 800,
						fontSize: 22,
						color,
						textShadow: '0 0 12px rgba(0,0,0,0.85)',
						whiteSpace: 'nowrap',
						letterSpacing: 1,
						textAlign: 'center',
					}}
				>
					<div>{label}</div>
					<div style={{fontSize: 26, marginTop: 2}}>{displayValue}</div>
				</div>
			</Html>
		</group>
	);
};
