import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {pushIn} from '../motion';
import {IconLayer} from '../IconLayer';
import {GlowOverlay} from '../GlowOverlay';
import {ASSETS, COLORS} from '../theme';

// Beats 6 (frames 570-750) + 7 (frames 750-870): a deliberate scale-distortion
// composite — the flour jar rendered huge, the widow small beside it — to
// sell how disproportionate the ask feels to her. One continuous shot: the
// slow zoom on the jar runs the full 10s, and the cold glow overlay (beat 7)
// simply fades in partway through rather than starting a new shot.
export const SHOT_D_DURATION = 300; // 10.0s @ 30fps

const GLOW_START = 180; // local frame = 750 absolute (beat 7 start)
const GLOW_FADE_FRAMES = 45;

export const ShotD_JarComposite: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const jarScale = pushIn(frame, SHOT_D_DURATION, 1, 1.14);
	const glowIntensity = interpolate(frame, [GLOW_START, GLOW_START + GLOW_FADE_FRAMES], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<IconLayer src={ASSETS.flourJarHero} width={640} left="58%" top="46%" scale={jarScale} />
			<GlowOverlay left="58%" top="46%" size={32} colorRGB={COLORS.coldGlowRGB} intensity={glowIntensity} frame={frame} fps={fps} />
			<IconLayer src={ASSETS.widowSmall} width={190} left="19%" top="74%" />
		</AbsoluteFill>
	);
};
