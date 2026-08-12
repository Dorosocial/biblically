import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {theme} from './lib/theme';
import {Scene} from './three/Scene';
import {Overlay} from './overlay/Overlay';

export const WIDTH = 1080;
export const HEIGHT = 1920;

/**
 * "A Second vs a Billion Years" — 9:16 scale-comparison video.
 *
 * Structure:
 *  - one persistent <ThreeCanvas> for the whole 66.8s take (Scene.tsx),
 *    driven by a single frame-indexed keyframe track (lib/sceneState.ts)
 *    so nothing pops or re-mounts across shot cuts.
 *  - one HTML/CSS overlay layer on top for all numbers/timelines/text
 *    (Overlay.tsx), cross-fading between shots.
 *  - narration audio starts at frame 0 and the composition's duration is
 *    locked to the real transcribed audio length (lib/timing.ts).
 */
export const SecondVsBillionYears: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: theme.backdrop}}>
			{/* Narration synced from frame 1 (frame 0), real Whisper-transcribed timing */}
			<Audio src={staticFile('audio/narration.mp3')} />

			<ThreeCanvas width={WIDTH} height={HEIGHT} linear>
				<fog attach="fog" args={[theme.fogColor, 14, 70]} />
				<Scene />
			</ThreeCanvas>

			<Overlay />
		</AbsoluteFill>
	);
};
