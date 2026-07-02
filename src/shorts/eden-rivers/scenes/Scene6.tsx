import {AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {MiddleEastMap} from '../MiddleEastMap';
import {ASSETS, LAYOUT} from '../theme';
import {cushProgress, SCENE_STARTS} from '../timeline';

// VO: "which in ancient geography refers to the region south and east of
// Mesopotamia. Both descriptions point toward the same basin: the
// northern Persian Gulf."
export const SCENE_6_DURATION = 330; // 11.0s @ 30fps

const DIM_WINDOW = [115, 175] as const; // 1300-1360
const GLOW_RISE_WINDOW = [125, 175] as const;
const PULSE_START = 175;
const PULSE_HZ = 0.8;
const PULSE_AMPLITUDE = 0.12;

export const Scene6: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const globalFrame = frame + SCENE_STARTS.scene6;

	const cush = cushProgress(globalFrame);

	const dim = interpolate(frame, DIM_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const glowRise = interpolate(frame, GLOW_RISE_WINDOW, [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const pulseLocal = frame - PULSE_START;
	const basinGlow =
		pulseLocal < 0 ? glowRise : 1 + PULSE_AMPLITUDE * Math.sin((pulseLocal / fps) * 2 * Math.PI * PULSE_HZ);

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{top: LAYOUT.bibleTop, alignItems: 'center'}}>
				<Img src={ASSETS.bible} style={{width: LAYOUT.bibleWidth}} />
			</AbsoluteFill>

			<AbsoluteFill style={{top: LAYOUT.contentTop, alignItems: 'center'}}>
				<MiddleEastMap
					width={880}
					pishon={{progress: 1, pop: 1}}
					gihon={{progress: 1, pop: 1}}
					euphrates={{progress: 1, pop: 1}}
					tigris={{progress: 1, pop: 1}}
					regions={{turkey: 1, syria: 1, iraq: 1, havilah: 1, cush}}
					pin={{dropProgress: 1, pulseScale: 1 + 0.08 * Math.sin((frame / fps) * 2 * Math.PI * 1.25)}}
					dim={dim}
					basinGlow={basinGlow}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
