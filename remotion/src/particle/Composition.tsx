import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {theme} from './theme';
import {Scene} from './three/Scene';
import {Overlay} from './overlay/Overlay';

export const WIDTH = 1080;
export const HEIGHT = 1920;

/**
 * "How Can One Particle Be in Two Places at the Same Time?" — 9:16
 * double-slit-experiment explainer.
 *
 * Structure mirrors the other video in this repo:
 *  - one persistent <ThreeCanvas> for the whole 72.8s take (three/Scene.tsx),
 *    driven by a single frame-indexed keyframe track (sceneState.ts).
 *  - one HTML/CSS overlay layer for the short labels (overlay/Overlay.tsx).
 *  - narration audio starts at frame 0; duration is locked to the real
 *    transcribed audio length (timing.ts).
 *
 * Science-accuracy notes applied throughout (see sceneState.ts / ShotOverlay.tsx):
 *  - "quantum mechanics can describe a particle in a superposition…" framing
 *  - the particle never visually splits into two duplicate particle-balls —
 *    that idea is represented by the wavefunction (WaveField) extending
 *    through both paths, and by the "2 PARTICLES?" text question, never by
 *    two discrete objects.
 */
export const ParticleSuperposition: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: theme.backdrop}}>
			<Audio src={staticFile('audio/particle-narration.mp3')} />

			<ThreeCanvas width={WIDTH} height={HEIGHT} linear>
				<fog attach="fog" args={[theme.fogColor, 6, 45]} />
				<Scene />
			</ThreeCanvas>

			<Overlay />
		</AbsoluteFill>
	);
};
