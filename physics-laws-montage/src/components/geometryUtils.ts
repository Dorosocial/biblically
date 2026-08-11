import * as THREE from 'three';

const UP = new THREE.Vector3(0, 1, 0);

/**
 * Quaternion that rotates a Y-aligned mesh (cylinders/cones default to this)
 * so its long axis points along `direction`.
 */
export const alignmentQuaternion = (
	direction: [number, number, number],
): [number, number, number, number] => {
	const dir = new THREE.Vector3(...direction);
	if (dir.lengthSq() === 0) {
		return [0, 0, 0, 1];
	}
	dir.normalize();
	const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir);
	return [quat.x, quat.y, quat.z, quat.w];
};

export const vecSub = (
	a: [number, number, number],
	b: [number, number, number],
): [number, number, number] => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

export const vecLength = (v: [number, number, number]): number =>
	Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

export const vecMid = (
	a: [number, number, number],
	b: [number, number, number],
): [number, number, number] => [
	(a[0] + b[0]) / 2,
	(a[1] + b[1]) / 2,
	(a[2] + b[2]) / 2,
];
