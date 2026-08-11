import React, {useMemo} from 'react';
import * as THREE from 'three';

/**
 * Procedural bicycle wheel — REUSED COMPONENT.
 *
 * Same build approach as the earlier gyroscopic-precession video's wheel:
 * a torus rim, cylinder spokes radiating from a central hub cylinder, and a
 * brushed-metal material. Kept generic (radius/spoke-count/spin are props)
 * so it can keep being reused wherever a spinning wheel is needed, rather
 * than being rebuilt per-project.
 *
 * The wheel's own local plane is XY (the torus's natural plane), spinning
 * about its local Z axis — that Z axis IS the axle. Callers orient the whole
 * wheel in the world by rotating/positioning this component's outer group
 * (see `AngularMomentumAct`, where the axle is tilted to show precession).
 */
export const BRUSHED_METAL_COLOR = '#c3c8d1';

export const BicycleWheel: React.FC<{
	readonly radius?: number;
	readonly tubeRadius?: number;
	readonly spokeCount?: number;
	readonly hubRadius?: number;
	readonly axleLength?: number;
	/** Current spin angle (radians) about the wheel's own axle (local Z). */
	readonly spin?: number;
	readonly color?: string;
	readonly position?: [number, number, number];
	readonly rotation?: [number, number, number];
	readonly scale?: number;
}> = ({
	radius = 1.55,
	tubeRadius = 0.06,
	spokeCount = 12,
	hubRadius = 0.14,
	axleLength = 2.6,
	spin = 0,
	color = BRUSHED_METAL_COLOR,
	position = [0, 0, 0],
	rotation = [0, 0, 0],
	scale = 1,
}) => {
	const spokes = useMemo(() => {
		return new Array(spokeCount).fill(0).map((_, i) => {
			const angle = (i / spokeCount) * Math.PI * 2;
			const spokeLength = radius - tubeRadius;
			const x = (Math.cos(angle) * spokeLength) / 2;
			const y = (Math.sin(angle) * spokeLength) / 2;
			const zRot = angle - Math.PI / 2;
			return {key: i, x, y, zRot, spokeLength};
		});
	}, [spokeCount, radius, tubeRadius]);

	const metalProps = {
		color,
		metalness: 0.8,
		roughness: 0.42,
	};

	return (
		<group position={position} rotation={rotation} scale={scale}>
			{/* Axle — extends through the hub, long enough for a figure to hold. */}
			<mesh rotation={[Math.PI / 2, 0, 0]}>
				<cylinderGeometry args={[0.045, 0.045, axleLength, 16]} />
				<meshStandardMaterial color="#8b8f98" metalness={0.9} roughness={0.5} />
			</mesh>

			{/* Everything that spins lives in this group, rotated by `spin`. */}
			<group rotation={[0, 0, spin]}>
				{/* Rim — torus in the wheel's natural XY plane. */}
				<mesh>
					<torusGeometry args={[radius, tubeRadius, 16, 48]} />
					<meshStandardMaterial {...metalProps} />
				</mesh>

				{/* Hub — short cylinder capping the axle at the wheel's center. */}
				<mesh rotation={[Math.PI / 2, 0, 0]}>
					<cylinderGeometry args={[hubRadius, hubRadius, 0.16, 20]} />
					<meshStandardMaterial {...metalProps} />
				</mesh>

				{/* Spokes — cylinders radiating from the hub to the rim. */}
				{spokes.map(({key, x, y, zRot, spokeLength}) => (
					<mesh key={key} position={[x, y, 0]} rotation={[0, 0, zRot]}>
						<cylinderGeometry args={[0.018, 0.018, spokeLength, 8]} />
						<meshStandardMaterial {...metalProps} roughness={0.3} />
					</mesh>
				))}
			</group>
		</group>
	);
};

/** Quick reusable helper: builds a THREE.Euler-friendly axle direction vector. */
export const axleDirection = (
	rotation: [number, number, number],
): THREE.Vector3 => {
	const euler = new THREE.Euler(rotation[0], rotation[1], rotation[2]);
	return new THREE.Vector3(0, 0, 1).applyEuler(euler);
};
