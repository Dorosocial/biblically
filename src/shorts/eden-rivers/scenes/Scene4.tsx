import {AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MiddleEastMap} from '../MiddleEastMap';
import {ASSETS, LAYOUT} from '../theme';

// VO: "Today, they've been identified to flow through Turkey, Syria and
// Iraq before meeting near Basra. That intersection is our anchor point."
export const SCENE_4_DURATION = 291; // 9.7s @ 30fps

const TURKEY_WINDOW = [0, 30] as const;
const SYRIA_WINDOW = [30, 60] as const;
const IRAQ_WINDOW = [60, 90] as const;
const PIN_DROP_START = 90;
const PIN_DROP_DURATION = 42; // 90-132
const PIN_DROP_SPRING_CONFIG = {damping: 9, stiffness: 120, mass: 1};

const PULSE_START = PIN_DROP_START + PIN_DROP_DURATION; // 132
const PULSE_HZ = 1.25;
const PULSE_AMPLITUDE = 0.08;

const highlightProgress = (frame: number, fps: number, [start, end]: readonly [number, number]) => {
	const local = frame - start;
	if (local < 0) return 0;
	if (frame >= end) return 1;
	return spring({frame: local, fps, config: {damping: 14, stiffness: 140, mass: 0.7}, durationInFrames: end - start});
};

export const Scene4: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const turkeyProgress = highlightProgress(frame, fps, TURKEY_WINDOW);
	const syriaProgress = highlightProgress(frame, fps, SYRIA_WINDOW);
	const iraqProgress = highlightProgress(frame, fps, IRAQ_WINDOW);

	const pinLocalFrame = frame - PIN_DROP_START;
	const pinDropProgress =
		pinLocalFrame < 0
			? 0
			: frame >= PIN_DROP_START + PIN_DROP_DURATION
				? 1
				: spring({frame: pinLocalFrame, fps, config: PIN_DROP_SPRING_CONFIG, durationInFrames: PIN_DROP_DURATION});

	const pulseLocalFrame = frame - PULSE_START;
	const pulseScale =
		pulseLocalFrame < 0 ? 1 : 1 + PULSE_AMPLITUDE * Math.sin((pulseLocalFrame / fps) * 2 * Math.PI * PULSE_HZ);

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{top: LAYOUT.bibleTop, alignItems: 'center'}}>
				<Img src={ASSETS.bible} style={{width: LAYOUT.bibleWidth}} />
			</AbsoluteFill>

			<AbsoluteFill style={{top: LAYOUT.contentTop, alignItems: 'center'}}>
				<MiddleEastMap
					width={880}
					pishon={{progress: 1}}
					gihon={{progress: 1}}
					euphrates={{progress: 1, pop: 1}}
					tigris={{progress: 1, pop: 1}}
					regions={{turkey: turkeyProgress, syria: syriaProgress, iraq: iraqProgress}}
					pin={frame >= PIN_DROP_START ? {dropProgress: pinDropProgress, pulseScale} : undefined}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
