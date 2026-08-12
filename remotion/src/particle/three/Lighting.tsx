import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FPS} from '../timing';

/**
 * No HDRI. Ambient fill + a directional key light give just enough shape to
 * the opaque classical ball and barrier; the particle/wave/screen elements
 * are emissive and are the primary light sources in the darker shots.
 */
export const Lighting: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / FPS;

	const keyX = Math.sin(t * 0.1) * 3 + 3;
	const rimZ = Math.cos(t * 0.08) * 3 - 4;

	return (
		<>
			<ambientLight intensity={0.75} color="#8b95d6" />
			<directionalLight position={[keyX, 5, 5]} intensity={2.0} color="#fff6e0" />
			<directionalLight position={[-4, -2, rimZ]} intensity={0.6} color="#7ef9ff" />
			<pointLight position={[0, 1.5, 2]} intensity={12} distance={16} color="#a78bfa" />
			<pointLight position={[0, 2.5, 6]} intensity={8} distance={20} color="#c9d4ff" />
		</>
	);
};
