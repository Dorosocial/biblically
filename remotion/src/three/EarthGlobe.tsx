import React from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {FPS} from '../lib/timing';
import {getOceanTexture} from './textures';
import {Continents} from './Continents';

interface Props {
	position?: [number, number, number];
	opacity: number;
	continentDrift: number;
	iceAmount: number;
	radius?: number;
	rotationSpeed?: number;
}

export const EarthGlobe: React.FC<Props> = ({
	position = [0, 0, 0],
	opacity,
	continentDrift,
	iceAmount,
	radius = 2.2,
	rotationSpeed = 1,
}) => {
	const frame = useCurrentFrame();
	const t = frame / FPS;
	const texture = getOceanTexture();

	if (opacity <= 0.001) return null;

	return (
		<group position={position} rotation={[0.15, t * 0.18 * rotationSpeed, 0]}>
			<mesh>
				<sphereGeometry args={[radius, 48, 48]} />
				<meshStandardMaterial map={texture} transparent opacity={opacity} roughness={0.65} metalness={0.05} />
			</mesh>
			{/* thin atmospheric glow rim */}
			<mesh>
				<sphereGeometry args={[radius * 1.04, 32, 32]} />
				<meshStandardMaterial
					color="#4fa4ff"
					emissive="#4fa4ff"
					emissiveIntensity={0.5}
					transparent
					opacity={opacity * 0.14}
					side={THREE.BackSide}
					depthWrite={false}
				/>
			</mesh>
			<Continents drift={continentDrift} earthRadius={radius} opacity={opacity} iceAmount={iceAmount} />
		</group>
	);
};
