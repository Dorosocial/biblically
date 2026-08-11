import React, {useMemo} from 'react';
import * as THREE from 'three';

// A tapered streak trailing behind a fast-moving ball. `from` -> `to` in
// local scene units; `opacity` lets shots fade the trail in/out.
export const MotionTrail: React.FC<{
	from: [number, number, number];
	to: [number, number, number];
	color?: string;
	width?: number;
	opacity?: number;
}> = ({from, to, color = '#ffd166', width = 0.16, opacity = 0.85}) => {
	const geometry = useMemo(() => {
		const start = new THREE.Vector3(...from);
		const end = new THREE.Vector3(...to);
		const dir = end.clone().sub(start);
		const len = dir.length() || 0.001;
		const mid = start.clone().add(end).multiplyScalar(0.5);

		const shape = new THREE.Shape();
		shape.moveTo(0, -width / 2);
		shape.lineTo(len * 0.7, -width / 6);
		shape.lineTo(len, 0);
		shape.lineTo(len * 0.7, width / 6);
		shape.lineTo(0, width / 2);
		shape.lineTo(0, -width / 2);

		const geo = new THREE.ShapeGeometry(shape);
		geo.translate(-len / 2, 0, 0);
		return {geo, mid, quat: quaternionFromTo(dir)};
	}, [from, to, width]);

	return (
		<mesh position={geometry.mid} quaternion={geometry.quat}>
			<primitive object={geometry.geo} attach="geometry" />
			<meshBasicMaterial
				color={color}
				transparent
				opacity={opacity}
				side={THREE.DoubleSide}
				depthWrite={false}
			/>
		</mesh>
	);
};

function quaternionFromTo(dir: THREE.Vector3) {
	const q = new THREE.Quaternion();
	const normalized = dir.clone().normalize();
	q.setFromUnitVectors(new THREE.Vector3(1, 0, 0), normalized);
	return q;
}
