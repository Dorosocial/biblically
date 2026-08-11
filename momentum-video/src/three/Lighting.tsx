import React from 'react';
import {useCurrentFrame} from 'remotion';

// All lighting authored in code — no HDRI / environment map anywhere.
// Kept to a minimal light count on purpose: this renders on software WebGL
// (no GPU in this environment), where every extra light multiplies the
// per-pixel shading cost across 1700+ frames.
export const LightingRig: React.FC<{emphasis?: [number, number, number]}> = () => {
	const frame = useCurrentFrame();
	// Faint flicker on the key light so the whole frame never reads as a
	// static render, even in beats where nothing else moves much.
	const flicker = 1 + Math.sin(frame / 26) * 0.03;

	return (
		<>
			<ambientLight intensity={0.95} color="#5a6c95" />
			<directionalLight position={[6, 9, 6]} intensity={3.6 * flicker} color="#ffffff" />
			{/* cool rim/back light to separate the dark giant ball from the backdrop */}
			<directionalLight position={[-6, 3, -6]} intensity={3} color="#7fe0ff" />
			{/* low warm bounce to keep the dark giant ball readable from below */}
			<pointLight position={[0, -4, 4]} intensity={1.1} color="#ff8a3d" distance={12} />
			{/* soft front fill so nothing ever reads as a pure black silhouette */}
			<directionalLight position={[0, 0, 10]} intensity={1.1} color="#c9d6ff" />
		</>
	);
};

export const Backdrop: React.FC = () => {
	// Dark slate backdrop (lightened from near-black for legibility): still
	// reads as a plain, dramatic dark backdrop, but the metallic spheres,
	// trails, and arrows now have real contrast to pop against instead of
	// nearly vanishing into it. No grid, no HDRI.
	return (
		<mesh position={[0, 0, -10]}>
			<planeGeometry args={[60, 90]} />
			<meshStandardMaterial color="#1b2338" roughness={1} metalness={0} />
		</mesh>
	);
};
