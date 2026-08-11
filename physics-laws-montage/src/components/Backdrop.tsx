import React from 'react';
import * as THREE from 'three';

/**
 * Deep charcoal-navy backdrop. No HDRI, no environment file, no grid — a
 * single solid-color dome plus matching fog so every focal object (brushed
 * metal, glowing vectors, energy bars, white labels) reads with maximum
 * contrast against it from any camera angle.
 */
export const BACKDROP_COLOR = '#151b2e';

export const Backdrop: React.FC<{readonly center?: [number, number, number]}> = ({
	center = [0, 2, 0],
}) => {
	return (
		<>
			<fog attach="fog" args={[BACKDROP_COLOR, 18, 46]} />
			<mesh position={center}>
				<sphereGeometry args={[40, 32, 32]} />
				<meshBasicMaterial color={BACKDROP_COLOR} side={THREE.BackSide} />
			</mesh>
		</>
	);
};
