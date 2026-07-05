import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe} from '../motion';
import {SceneImage} from '../SceneImage';
import {Vignette} from '../Vignette';
import {TextCaption} from '../TextCaption';
import {ASSETS} from '../theme';

// Beats 18 (2400-2520) + 19 (2520-2640): the cracked, barren famine
// landscape. One continuous 8s shot — the "3.5 Years" citation fades in
// over beat 18 while the vignette darkens continuously across the full
// shot, intensifying through beat 19.
export const SHOT_I_DURATION = 240; // 8.0s @ 30fps

const TEXT_FADE_WINDOW = [0, 60] as const; // beat 18 span
const VIGNETTE_WINDOW = [0, 240] as const; // continuous across the full shot

export const ShotI_FamineLandscape: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = breathe(frame, fps, 0.01, 0.12);
	const textOpacity = interpolate(frame, TEXT_FADE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const vignetteIntensity = interpolate(frame, VIGNETTE_WINDOW, [0, 0.85], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill>
			<SceneImage src={ASSETS.famineLandscape} scale={scale} />
			<Vignette intensity={vignetteIntensity} />
			<TextCaption text="3.5 Years" opacity={textOpacity} />
		</AbsoluteFill>
	);
};
