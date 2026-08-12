// Force/velocity vectors as real 3D objects (thin cylinder shaft + cone
// head) so they read correctly from any angle during orbiting/rotating
// camera shots — never a billboarded sprite or 2D overlay. Used for the
// inward (centripetal), outward (centrifugal, apparent-only), and
// tangential (velocity) vectors throughout.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import type {V3} from './math';

const UP = new THREE.Vector3(0, 1, 0);

export const Arrow3D: React.FC<{
	origin: V3;
	direction: V3; // need not be normalized
	length: number;
	radius?: number;
	color?: string;
	opacity?: number;
	emissiveIntensity?: number;
}> = ({origin, direction, length, radius = 0.045, color = '#ffb020', opacity = 1, emissiveIntensity = 1.4}) => {
	const quaternion = useMemo(() => {
		const dir = new THREE.Vector3(...direction);
		if (dir.lengthSq() < 1e-8) return new THREE.Quaternion();
		dir.normalize();
		return new THREE.Quaternion().setFromUnitVectors(UP, dir);
	}, [direction[0], direction[1], direction[2]]);

	if (length <= 0.001 || opacity <= 0.01) return null;

	const shaftLen = length * 0.72;
	const headLen = length * 0.28;

	return (
		<group position={origin} quaternion={quaternion}>
			<mesh position={[0, shaftLen / 2, 0]}>
				<cylinderGeometry args={[radius, radius, shaftLen, 12]} />
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={emissiveIntensity}
					roughness={0.35}
					metalness={0.2}
					transparent
					opacity={opacity}
				/>
			</mesh>
			<mesh position={[0, shaftLen + headLen / 2, 0]}>
				<coneGeometry args={[radius * 2.3, headLen, 16]} />
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={emissiveIntensity * 1.2}
					roughness={0.3}
					metalness={0.2}
					transparent
					opacity={opacity}
				/>
			</mesh>
		</group>
	);
};
