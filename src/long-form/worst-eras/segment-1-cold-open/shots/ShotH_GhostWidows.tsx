import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe} from '../motion';
import {SceneImage} from '../SceneImage';
import {ParticleField} from '../ParticleField';
import {ASSETS} from '../theme';

// Beats 15 (1950-2070) + 16 (2070-2280) + 17 (2280-2400): the faded, ghostly
// repeated widow silhouettes — every widow who faced this famine. One
// continuous 15s shot: the image itself fades in over beat 15, then the
// dust-particle field fades in and drifts continuously from beat 16 through
// the beat 17 hold.
export const SHOT_H_DURATION = 450; // 15.0s @ 30fps

const IMAGE_FADE_WINDOW = [0, 120] as const; // beat 15 span
const PARTICLE_START = 120; // local frame = 2070 absolute (beat 16 start)
const PARTICLE_FADE_FRAMES = 40;

export const ShotH_GhostWidows: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const imageOpacity = interpolate(frame, IMAGE_FADE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const scale = breathe(frame, fps, 0.01, 0.14);
	const particleIntensity = interpolate(frame, [PARTICLE_START, PARTICLE_START + PARTICLE_FADE_FRAMES], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<SceneImage src={ASSETS.ghostWidows} opacity={imageOpacity} scale={scale} />
			<ParticleField frame={frame} fps={fps} intensity={particleIntensity} />
		</AbsoluteFill>
	);
};
