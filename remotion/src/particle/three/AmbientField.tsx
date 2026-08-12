import React, {useMemo, useLayoutEffect, useRef} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {FPS} from '../timing';

interface Props {
	intensity: number;
}

const COUNT = 360;

/** Always-on drifting dust field so the screen is never a true static frame. */
export const AmbientField: React.FC<Props> = ({intensity}) => {
	const pointsRef = useRef<THREE.Points>(null);
	const materialRef = useRef<THREE.PointsMaterial>(null);
	const frame = useCurrentFrame();
	const t = frame / FPS;

	const {positions, seeds} = useMemo(() => {
		const pos = new Float32Array(COUNT * 3);
		const seedArr = new Float32Array(COUNT);
		let seedVal = 777;
		const rand = () => {
			seedVal = (seedVal * 1103515245 + 12345) & 0x7fffffff;
			return (seedVal % 10000) / 10000;
		};
		for (let i = 0; i < COUNT; i++) {
			const radius = 3 + rand() * 30;
			const theta = rand() * Math.PI * 2;
			const phi = Math.acos(rand() * 2 - 1);
			pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
			pos[i * 3 + 1] = radius * Math.cos(phi) * 0.5;
			pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
			seedArr[i] = rand() * 1000;
		}
		return {positions: pos, seeds: seedArr};
	}, []);

	const displaced = useMemo(() => {
		const arr = new Float32Array(positions.length);
		for (let i = 0; i < COUNT; i++) {
			const s = seeds[i];
			arr[i * 3] = positions[i * 3] + Math.sin(t * 0.17 + s) * 0.5;
			arr[i * 3 + 1] = positions[i * 3 + 1] + Math.sin(t * 0.12 + s * 1.3) * 0.4;
			arr[i * 3 + 2] = positions[i * 3 + 2] + Math.cos(t * 0.14 + s * 0.7) * 0.5;
		}
		return arr;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [t]);

	useLayoutEffect(() => {
		if (pointsRef.current) {
			pointsRef.current.rotation.y = t * 0.015;
		}
		if (materialRef.current) {
			const pulse = 0.6 + Math.sin(t * 0.7) * 0.4;
			materialRef.current.opacity = intensity * (0.3 + pulse * 0.25);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [displaced, intensity, t]);

	return (
		<points ref={pointsRef}>
			<bufferGeometry>
				<bufferAttribute attach="attributes-position" args={[displaced, 3]} />
			</bufferGeometry>
			<pointsMaterial
				ref={materialRef}
				color="#b9a9ff"
				size={0.1}
				transparent
				opacity={intensity * 0.35}
				sizeAttenuation
				depthWrite={false}
			/>
		</points>
	);
};
