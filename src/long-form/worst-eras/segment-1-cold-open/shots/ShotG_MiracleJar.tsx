import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe, pushIn} from '../motion';
import {SceneImage} from '../SceneImage';
import {GlowOverlay} from '../GlowOverlay';
import {TextCaption} from '../TextCaption';
import {ASSETS, COLORS} from '../theme';

// Beats 12 (1470-1650) + 13 (1650-1830) + 14 (1830-1950): the miracle —
// hands pouring oil that doesn't run out. One continuous 16s shot: the
// "1 Kings 17" citation fades in during beat 12, the warm golden glow
// bloom fades in and pulses starting at beat 13, and beat 14 is an idle
// hold with both already-established elements still alive.
export const SHOT_G_DURATION = 480; // 16.0s @ 30fps

const TEXT_FADE_WINDOW = [0, 60] as const; // beat 12 span
const GLOW_START = 180; // local frame = 1650 absolute (beat 13 start)
const GLOW_FADE_FRAMES = 45;

export const ShotG_MiracleJar: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = pushIn(frame, SHOT_G_DURATION, 1, 1.05) * breathe(frame, fps, 0.008, 0.15);
	const textOpacity = interpolate(frame, TEXT_FADE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const glowIntensity = interpolate(frame, [GLOW_START, GLOW_START + GLOW_FADE_FRAMES], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<SceneImage src={ASSETS.miracleJar} scale={scale} />
			<GlowOverlay left="50%" top="45%" size={55} colorRGB={COLORS.warmGlowRGB} intensity={glowIntensity} frame={frame} fps={fps} />
			<TextCaption text="1 Kings 17" opacity={textOpacity} />
		</AbsoluteFill>
	);
};
