import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';

// A 3D arrow (shaft + cone head) representing a momentum/velocity vector.
// `length` scales with relative momentum magnitude so "equal momentum" shots
// can literally show two equal-length arrows.
export const MomentumArrow: React.FC<{
	origin: [number, number, number];
	direction: [number, number, number];
	length: number;
	color?: string;
	opacity?: number;
	pulse?: boolean;
	seed?: number;
}> = ({origin, direction, length, color = '#ffffff', opacity = 1, pulse = true, seed = 0}) => {
	const frame = useCurrentFrame();
	const wobble = pulse ? 1 + Math.sin(frame / 8 + seed) * 0.04 : 1;
	const len = Math.max(length * wobble, 0.05);

	const {quat, shaftLen, headLen} = useMemo(() => {
		const dir = new THREE.Vector3(...direction).normalize();
		const q = new THREE.Quaternion();
		q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
		const headLen = Math.min(0.35, len * 0.3);
		return {quat: q, shaftLen: Math.max(len - headLen, 0.02), headLen};
	}, [direction, len]);

	return (
		<group position={origin} quaternion={quat}>
			<mesh position={[0, shaftLen / 2, 0]}>
				<cylinderGeometry args={[0.05, 0.05, shaftLen, 12]} />
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={0.6}
					transparent
					opacity={opacity}
				/>
			</mesh>
			<mesh position={[0, shaftLen + headLen / 2, 0]}>
				<coneGeometry args={[0.14, headLen, 16]} />
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={0.6}
					transparent
					opacity={opacity}
				/>
			</mesh>
		</group>
	);
};
