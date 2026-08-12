import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {FPS} from '../lib/timing';
import {theme} from '../lib/theme';

interface Props {
	position?: [number, number, number];
	opacity: number;
	/** 0 = flat ground, 1 = full jagged peaks (used for both grow + erode) */
	height: number;
	size?: number;
}

const SEG = 28;

// cheap deterministic value-noise (no external noise lib needed)
const noise2 = (x: number, y: number) => {
	const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
	return s - Math.floor(s);
};

const fbm = (x: number, y: number) => {
	let sum = 0;
	let amp = 1;
	let freq = 1;
	for (let o = 0; o < 4; o++) {
		sum += noise2(x * freq + o * 11.1, y * freq - o * 7.3) * amp;
		amp *= 0.5;
		freq *= 2.05;
	}
	return sum;
};

/**
 * Displaced-terrain mountain range: grid geometry whose vertex heights are
 * recomputed every frame from `height` (0..1) so a single component can
 * both "grow" and "erode" just by animating that one control value.
 */
export const Mountains: React.FC<Props> = ({position = [0, 0, 0], opacity, height, size = 6}) => {
	const frame = useCurrentFrame();
	const t = frame / FPS;

	const geometry = useMemo(() => {
		const geo = new THREE.PlaneGeometry(size, size, SEG, SEG);
		geo.rotateX(-Math.PI / 2);
		return geo;
	}, [size]);

	const positionAttr = useMemo(() => {
		const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
		const arr = posAttr.array as Float32Array;
		const erosionJitter = 1 - height * 0.15; // slightly softer silhouette once "eroded"
		for (let i = 0; i < posAttr.count; i++) {
			const x = arr[i * 3];
			const z = arr[i * 3 + 2];
			const n = fbm(x * 0.35 + 5, z * 0.35 - 5) * erosionJitter;
			const ridge = Math.pow(n, 1.6);
			arr[i * 3 + 1] = ridge * 2.6 * height + Math.sin(t * 0.4 + x) * 0.01;
		}
		posAttr.needsUpdate = true;
		geometry.computeVertexNormals();
		return posAttr;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [geometry, height, t]);

	if (opacity <= 0.001) return null;

	return (
		<group position={position}>
			<mesh geometry={geometry}>
				<meshStandardMaterial
					color={theme.mountainRock}
					emissive={theme.mountainRockLit}
					emissiveIntensity={0.12}
					transparent
					opacity={opacity}
					roughness={0.95}
					flatShading
				/>
			</mesh>
		</group>
	);
};
