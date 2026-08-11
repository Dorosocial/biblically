import React from 'react';
import type {Vec3} from './CameraRig';

/**
 * All lighting is built in code — no HDRI, no environment map. A soft ambient
 * fill keeps shadow sides readable, one directional key light rakes across
 * the scene for dramatic falloff, and each shot adds its own focal
 * point/spot light (accentColor) so the current hero object always reads as
 * the brightest, most saturated thing on screen.
 */
export const SceneLighting: React.FC<{
	/** Focal light aimed at the current hero object. */
	readonly focalPosition: Vec3;
	readonly focalColor?: string;
	readonly focalIntensity?: number;
	readonly keyColor?: string;
}> = ({
	focalPosition,
	focalColor = '#ffffff',
	focalIntensity = 2.6,
	keyColor = '#fff4e0',
}) => {
	return (
		<>
			{/* Ambient fill — keeps the dark backdrop from swallowing shadow sides. */}
			<ambientLight intensity={0.85} color="#aab8d6" />
			{/* Hemisphere fill — soft sky/ground gradient so nothing goes pure black,
			    without flattening the directional shadow sides. */}
			<hemisphereLight color="#cfe0ff" groundColor="#1a1f2e" intensity={0.6} />

			{/* Directional key light — the main dramatic rake across the scene.
			    Directional lights don't fall off with distance, so they stay
			    reliable whether a shot is a wide establishing frame or an
			    extreme close-up. */}
			<directionalLight
				position={[6, 10, 6]}
				intensity={4.6}
				color={keyColor}
			/>
			{/* Cool rim light from behind to separate silhouettes from the backdrop. */}
			<directionalLight
				position={[-5, 4, -8]}
				intensity={2.6}
				color="#5ac8ff"
			/>

			{/* Per-shot focal point light — emphasis on whatever is the hero object.
			    decay={0} (no inverse-square attenuation) so the same intensity
			    reads consistently whether the camera is inches away or across
			    the room — only `distance` caps its reach. */}
			<pointLight
				position={focalPosition}
				intensity={focalIntensity}
				color={focalColor}
				distance={14}
				decay={0}
			/>
		</>
	);
};
