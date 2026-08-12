import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FPS} from '../lib/timing';

/**
 * All lighting is built in code (no HDRI/environment map):
 *  - a soft blue ambient fill so nothing ever goes fully black
 *  - a warm directional key light, for shape/shadow read on Earth + terrain
 *  - two point lights that drift gently for per-shot emphasis / sparkle,
 *    which also doubles as part of the "never fully static" continuous
 *    motion requirement.
 */
export const Lighting: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / FPS;

	const key1x = Math.sin(t * 0.12) * 3 + 4;
	const key1y = 3 + Math.sin(t * 0.2) * 0.6;
	const key2x = Math.cos(t * 0.09) * 4 - 3;

	return (
		<>
			<ambientLight intensity={0.55} color="#8fb8ff" />
			<directionalLight position={[5, 6, 4]} intensity={1.35} color="#fff3da" />
			<directionalLight position={[-6, -2, -4]} intensity={0.25} color="#4fa4ff" />
			<pointLight position={[key1x, key1y, 5]} intensity={18} distance={20} color="#7dd3fc" />
			<pointLight position={[key2x, -2, 6]} intensity={12} distance={18} color="#fbbf24" />
		</>
	);
};
