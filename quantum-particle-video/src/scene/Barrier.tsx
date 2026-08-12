// The barrier: a flat panel with two slit openings cut through it, built
// from three solid segments (left / center / right) with gaps between them
// standing in for the slits — simplest possible way to get real geometric
// holes without a discard-shader.
import React from 'react';
import type {V3} from './math';

export const Barrier: React.FC<{
	position: V3;
	opacity?: number;
	slitGap?: number; // distance between the two slit centers
	slitWidth?: number;
	panelHeight?: number;
	panelWidth?: number;
	color?: string;
}> = ({
	position,
	opacity = 1,
	slitGap = 1.1,
	slitWidth = 0.32,
	panelHeight = 1.7,
	panelWidth = 2.5,
	color = '#7c88ab',
}) => {
	if (opacity <= 0.01) return null;

	const halfGap = slitGap / 2;
	const centerWidth = slitGap - slitWidth;
	const sideWidth = (panelWidth - slitGap - slitWidth) / 2;
	const leftX = -halfGap - slitWidth / 2 - sideWidth / 2;
	const rightX = halfGap + slitWidth / 2 + sideWidth / 2;

	// A faint emissive tint keeps the panel readable as a dim-lit shape even
	// when a shot pushes close to it, instead of reading as a flat black void.
	const material = (
		<meshStandardMaterial
			color={color}
			emissive="#3c4a82"
			emissiveIntensity={1.3}
			roughness={0.55}
			metalness={0.3}
			transparent
			opacity={opacity}
		/>
	);

	return (
		<group position={position}>
			<mesh position={[leftX, 0, 0]}>
				<boxGeometry args={[sideWidth, panelHeight, 0.14]} />
				{material}
			</mesh>
			<mesh position={[0, 0, 0]}>
				<boxGeometry args={[centerWidth, panelHeight, 0.14]} />
				{material}
			</mesh>
			<mesh position={[rightX, 0, 0]}>
				<boxGeometry args={[sideWidth, panelHeight, 0.14]} />
				{material}
			</mesh>
		</group>
	);
};
