import React from 'react';
import {alignmentQuaternion, vecLength, vecMid, vecSub} from './geometryUtils';

export const METAL_SPHERE_COLOR = '#d8dbe2';

/** A single polished-metal sphere, used for the cradle balls and the bouncing ball. */
export const MetallicSphere: React.FC<{
	readonly radius?: number;
	readonly position?: [number, number, number];
	readonly color?: string;
	readonly emissive?: string;
	readonly emissiveIntensity?: number;
}> = ({
	radius = 0.5,
	position = [0, 0, 0],
	color = METAL_SPHERE_COLOR,
	emissive = '#000000',
	emissiveIntensity = 0,
}) => {
	return (
		<mesh position={position} castShadow receiveShadow>
			<sphereGeometry args={[radius, 48, 48]} />
			<meshStandardMaterial
				color={color}
				metalness={1}
				roughness={0.22}
				emissive={emissive}
				emissiveIntensity={emissiveIntensity}
			/>
		</mesh>
	);
};

/** Thin wire/rod support, e.g. a cradle sphere's hanging support. */
export const WireSupport: React.FC<{
	readonly from: [number, number, number];
	readonly to: [number, number, number];
	readonly radius?: number;
}> = ({from, to, radius = 0.02}) => {
	const length = vecLength(vecSub(to, from));
	const mid = vecMid(from, to);
	const quaternion = alignmentQuaternion(vecSub(to, from));

	return (
		<mesh position={mid} quaternion={quaternion}>
			<cylinderGeometry args={[radius, radius, length, 8]} />
			<meshStandardMaterial color="#5b5f68" metalness={0.6} roughness={0.5} />
		</mesh>
	);
};
