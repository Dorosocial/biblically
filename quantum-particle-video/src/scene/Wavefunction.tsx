// The wavefunction / probability-amplitude visualization: a translucent,
// glowing, undulating shader-based field. This is the ONLY way the video
// represents "the particle taking both paths at once" — never as two
// discrete duplicate particle-balls. A WaveLobe is a soft undulating blob
// (used at each slit / possible position); a WaveSheet is a stretched,
// rippling ribbon connecting two lobes so the field reads as one continuous
// extended thing, not two separate objects.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {makeWaveMaterial} from './shaders';
import type {V3} from './math';

export const WaveLobe: React.FC<{
	position: V3;
	scale?: number;
	opacity?: number;
	time?: number;
	color?: string;
}> = ({position, scale = 1, opacity = 1, time = 0, color = '#8fd6ff'}) => {
	const material = useMemo(() => makeWaveMaterial(color), [color]);
	material.uniforms.uTime.value = time;
	material.uniforms.uOpacity.value = opacity;
	material.uniforms.uAmplitude.value = 0.16;

	if (opacity <= 0.002) return null;

	return (
		<mesh position={position} scale={scale} material={material}>
			<icosahedronGeometry args={[0.55, 4]} />
		</mesh>
	);
};

export const WaveSheet: React.FC<{
	from: V3;
	to: V3;
	opacity?: number;
	time?: number;
	color?: string;
	thickness?: number;
}> = ({from, to, opacity = 1, time = 0, color = '#8fd6ff', thickness = 0.5}) => {
	const material = useMemo(() => makeWaveMaterial(color), [color]);
	material.uniforms.uTime.value = time;
	material.uniforms.uOpacity.value = opacity * 0.7;
	material.uniforms.uAmplitude.value = 0.08;

	const {midpoint, length, quaternion} = useMemo(() => {
		const a = new THREE.Vector3(...from);
		const b = new THREE.Vector3(...to);
		const mid = a.clone().add(b).multiplyScalar(0.5);
		const dir = b.clone().sub(a);
		const len = dir.length();
		const q = new THREE.Quaternion().setFromUnitVectors(
			new THREE.Vector3(1, 0, 0),
			len > 0.0001 ? dir.normalize() : new THREE.Vector3(1, 0, 0),
		);
		return {midpoint: mid, length: len, quaternion: q};
	}, [from[0], from[1], from[2], to[0], to[1], to[2]]);

	if (opacity <= 0.002 || length <= 0.02) return null;

	return (
		<mesh position={midpoint} quaternion={quaternion} material={material}>
			<planeGeometry args={[length, thickness, 24, 6]} />
		</mesh>
	);
};

/** Multiple simultaneous possibility-lobes spread across the detector, for the "spread across multiple possibilities" / "multiple outcomes at once" beats. */
export const PossibilityCloud: React.FC<{
	center: V3;
	spreadX: number;
	count?: number;
	opacity?: number;
	time?: number;
	color?: string;
}> = ({center, spreadX, count = 5, opacity = 1, time = 0, color = '#8fd6ff'}) => {
	const positions = useMemo<V3[]>(() => {
		const arr: V3[] = [];
		for (let i = 0; i < count; i++) {
			const t = count === 1 ? 0 : i / (count - 1) - 0.5;
			arr.push([center[0] + t * spreadX * 2, center[1], center[2]]);
		}
		return arr;
	}, [center[0], center[1], center[2], spreadX, count]);

	return (
		<>
			{positions.map((p, i) => (
				<WaveLobe
					key={i}
					position={p}
					scale={0.38}
					opacity={opacity * (0.55 + 0.45 * Math.sin(time * 1.4 + i * 1.3))}
					time={time + i * 0.6}
					color={color}
				/>
			))}
		</>
	);
};
