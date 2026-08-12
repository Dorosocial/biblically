import React, {useMemo} from 'react';
import * as THREE from 'three';
import {theme} from '../lib/theme';

interface ContinentDef {
	// clustered (Pangaea-like) placement vs. spread-out placement, in degrees
	clusterLat: number;
	clusterLon: number;
	spreadLat: number;
	spreadLon: number;
	size: number;
}

const CONTINENTS: ContinentDef[] = [
	{clusterLat: 10, clusterLon: -10, spreadLat: 40, spreadLon: -80, size: 0.62},
	{clusterLat: -5, clusterLon: 15, spreadLat: 10, spreadLon: 20, size: 0.7},
	{clusterLat: -20, clusterLon: 5, spreadLat: -25, spreadLon: 135, size: 0.5},
	{clusterLat: 25, clusterLon: 20, spreadLat: 50, spreadLon: 60, size: 0.46},
	{clusterLat: -35, clusterLon: -15, spreadLat: -15, spreadLon: -60, size: 0.4},
	{clusterLat: 40, clusterLon: -5, spreadLat: 70, spreadLon: -100, size: 0.3},
];

const lerpDeg = (a: number, b: number, t: number) => a + (b - a) * t;

const latLonToVec = (lat: number, lon: number, radius: number): THREE.Vector3 => {
	const phi = (90 - lat) * (Math.PI / 180);
	const theta = (lon + 180) * (Math.PI / 180);
	return new THREE.Vector3(
		-radius * Math.sin(phi) * Math.cos(theta),
		radius * Math.cos(phi),
		radius * Math.sin(phi) * Math.sin(theta)
	);
};

interface Props {
	drift: number; // 0 = clustered supercontinent, 1 = spread modern-ish layout
	earthRadius: number;
	opacity: number;
	iceAmount: number;
}

const UP = new THREE.Vector3(0, 1, 0);

export const Continents: React.FC<Props> = ({drift, earthRadius, opacity, iceAmount}) => {
	const placements = useMemo(
		() =>
			CONTINENTS.map((c) => {
				const lat = lerpDeg(c.clusterLat, c.spreadLat, drift);
				const lon = lerpDeg(c.clusterLon, c.spreadLon, drift);
				const pos = latLonToVec(lat, lon, earthRadius * 1.012);
				const normal = pos.clone().normalize();
				const quat = new THREE.Quaternion().setFromUnitVectors(UP, normal);
				const isPolar = Math.abs(lat) > 55;
				return {pos, quat, size: c.size, isPolar};
			}),
		[drift, earthRadius]
	);

	const landColor = useMemo(() => {
		const modern = new THREE.Color(theme.earthLandModern);
		const prehistoric = new THREE.Color(theme.earthLandPrehistoric);
		return prehistoric.clone().lerp(modern, drift);
	}, [drift]);

	const iceColor = new THREE.Color(theme.earthIce);

	return (
		<group>
			{placements.map((p, i) => (
				<group key={i} position={p.pos} quaternion={p.quat}>
					<mesh scale={[p.size, p.size * 0.28, p.size * 0.82]}>
						<icosahedronGeometry args={[1, 1]} />
						<meshStandardMaterial
							color={p.isPolar ? iceColor.clone().lerp(landColor, 1 - iceAmount) : landColor}
							emissive={landColor}
							emissiveIntensity={0.4}
							transparent
							opacity={opacity}
							roughness={0.7}
						/>
					</mesh>
				</group>
			))}
		</group>
	);
};
