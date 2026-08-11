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
			<ambientLight intensity={0.55} color="#4a5b82" />
			<directionalLight position={[6, 9, 6]} intensity={2.8 * flicker} color="#ffffff" />
			{/* cool rim/back light to separate the dark giant ball from the backdrop */}
			<directionalLight position={[-6, 3, -6]} intensity={2.3} color="#5fd6ff" />
			{/* low warm bounce to keep the dark giant ball readable from below */}
			<pointLight position={[0, -4, 4]} intensity={0.6} color="#ff8a3d" distance={12} />
		</>
	);
};

export const Backdrop: React.FC = () => {
	// Deep indigo-black plain backdrop: makes the dark-metal giant ball's rim
	// light, the glowing tiny ball, and the bright white/yellow overlay arrows
	// all pop with maximum contrast. No grid, no HDRI.
	return (
		<mesh position={[0, 0, -10]}>
			<planeGeometry args={[60, 90]} />
			<meshStandardMaterial color="#080b14" roughness={1} metalness={0} />
		</mesh>
	);
};
