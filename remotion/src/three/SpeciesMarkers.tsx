import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {FPS} from '../lib/timing';
import {theme} from '../lib/theme';

interface Props {
	position?: [number, number, number];
	amount: number; // 0..1 appear/disappear
}

interface Marker {
	x: number;
	z: number;
	scale: number;
	kind: 'cone' | 'sphere' | 'spike';
	phase: number;
}

const MARKERS: Marker[] = [
	{x: -1.8, z: -0.6, scale: 0.42, kind: 'cone', phase: 0},
	{x: -0.6, z: 0.8, scale: 0.26, kind: 'sphere', phase: 1.1},
	{x: 0.6, z: -1.1, scale: 0.34, kind: 'spike', phase: 2.2},
	{x: 1.7, z: 0.4, scale: 0.3, kind: 'sphere', phase: 3.0},
	{x: 0.1, z: 1.6, scale: 0.4, kind: 'cone', phase: 0.6},
	{x: -1.4, z: 1.3, scale: 0.22, kind: 'spike', phase: 1.8},
];

/**
 * Simple representative silhouette forms standing in for "entire species can
 * appear / and even disappear" — deliberately abstract, no creature models.
 */
export const SpeciesMarkers: React.FC<Props> = ({position = [0, 0, 0], amount}) => {
	const frame = useCurrentFrame();
	const t = frame / FPS;

	const color = useMemo(() => new THREE.Color(theme.glowAmber), []);

	if (amount <= 0.001) return null;

	return (
		<group position={position}>
			{MARKERS.map((m, i) => {
				const bob = Math.sin(t * 1.4 + m.phase) * 0.04;
				const s = m.scale * amount;
				return (
					<mesh key={i} position={[m.x, s * 0.5 + bob, m.z]} scale={[s, s, s]}>
						{m.kind === 'cone' && <coneGeometry args={[0.5, 1, 8]} />}
						{m.kind === 'sphere' && <sphereGeometry args={[0.5, 12, 12]} />}
						{m.kind === 'spike' && <cylinderGeometry args={[0.02, 0.5, 1.2, 6]} />}
						<meshStandardMaterial
							color={color}
							emissive={color}
							emissiveIntensity={0.6}
							transparent
							opacity={amount * 0.9}
							roughness={0.6}
						/>
					</mesh>
				);
			})}
		</group>
	);
};
