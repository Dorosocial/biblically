import React from 'react';
import * as THREE from 'three';
import {theme} from '../theme';
import {SLIT_LEFT_X, SLIT_RIGHT_X} from './Barrier';

interface Props {
	opacity: number;
	glow: number; // 0..1 extra burst when actively measuring
	activeSide: number; // -1 left, 1 right, 0 neither
	position?: [number, number, number];
}

/** Small path detectors that sit beside each slit — "WHICH PATH?" */
export const Detectors: React.FC<Props> = ({opacity, glow, activeSide, position = [0, 0, 0.4]}) => {
	if (opacity <= 0.001) return null;

	const color = new THREE.Color(theme.detectorOff).lerp(new THREE.Color(theme.detectorOn), 0);

	return (
		<group position={position}>
			{[SLIT_LEFT_X, SLIT_RIGHT_X].map((x, i) => {
				const side = i === 0 ? -1 : 1;
				const isActive = activeSide === side;
				const litAmount = isActive ? glow : glow * 0.15;
				const c = color.clone().lerp(new THREE.Color(theme.detectorOn), litAmount);
				return (
					<mesh key={x} position={[x, -0.55, 0]}>
						<boxGeometry args={[0.22, 0.18, 0.18]} />
						<meshStandardMaterial color={c} emissive={theme.detectorOn} emissiveIntensity={litAmount * 1.6} transparent opacity={opacity} roughness={0.4} />
					</mesh>
				);
			})}
		</group>
	);
};
