import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MOUNTAIN_PEAK_COUNT, MountainRange} from '../MountainRange';
import {RiverOverlay} from '../RiverOverlay';
import {ASSETS, COLORS, LAYOUT} from '../theme';

// VO: "of Turkey and the Arabian plains."
export const SCENE_9_DURATION = 150; // 5.0s @ 30fps

const LABEL_SPRING_WINDOW = [0, 40] as const;
const TURKEY_LABEL_START = 0;
const ARABIA_LABEL_START = 15;

const VALLEY_WIDTH = 520;
const FULL_MOUNTAINS = Array.from({length: MOUNTAIN_PEAK_COUNT}, () => 1);

const labelProgress = (frame: number, fps: number, start: number) => {
	const local = frame - start;
	if (local < 0) return 0;
	if (local >= 30) return 1;
	return spring({frame: local, fps, config: {damping: 11, stiffness: 130, mass: 0.8}, durationInFrames: 30});
};

export const Scene9: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const turkeyLabel = labelProgress(frame, fps, TURKEY_LABEL_START);
	const arabiaLabel = labelProgress(frame, fps, ARABIA_LABEL_START);

	const height = VALLEY_WIDTH * (600 / 334);

	const labelStyle = (progress: number): React.CSSProperties => ({
		opacity: interpolate(progress, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
		transform: `scale(${interpolate(progress, [0, 1], [0.6, 1])})`,
		color: COLORS.mapLabel,
		fontFamily: 'sans-serif',
		fontSize: 26,
		fontWeight: 700,
		letterSpacing: 2,
		textAlign: 'center',
	});

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{top: LAYOUT.bibleTop, alignItems: 'center'}}>
				<Img src={ASSETS.bible} style={{width: LAYOUT.bibleWidth}} />
			</AbsoluteFill>

			<AbsoluteFill style={{top: LAYOUT.contentTop, alignItems: 'center'}}>
				<div style={{position: 'relative', width: VALLEY_WIDTH, height}}>
					<Img src={ASSETS.dryValley} style={{width: VALLEY_WIDTH}} />
					<RiverOverlay width={VALLEY_WIDTH} opacity={1} />
					<div style={{position: 'absolute', top: 0, left: 0, width: '100%'}}>
						<MountainRange edge="top" progress={FULL_MOUNTAINS} />
					</div>
					<div style={{position: 'absolute', bottom: 0, left: 0, width: '100%'}}>
						<MountainRange edge="bottom" progress={FULL_MOUNTAINS} />
					</div>

					<div style={{position: 'absolute', top: 14, left: 0, width: '100%', ...labelStyle(turkeyLabel)}}>
						TURKEY
					</div>
					<div style={{position: 'absolute', bottom: 14, left: 0, width: '100%', ...labelStyle(arabiaLabel)}}>
						ARABIAN PENINSULA
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
