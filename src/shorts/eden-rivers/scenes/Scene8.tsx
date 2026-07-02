import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MOUNTAIN_PEAK_COUNT, MountainRange} from '../MountainRange';
import {RiverOverlay} from '../RiverOverlay';
import {ASSETS, LAYOUT} from '../theme';

// VO: "fed by four converging rivers, sitting between the mountains"
export const SCENE_8_DURATION = 249; // 8.3s @ 30fps

const RIVER_FADE_IN = [0, 78] as const; // 1842-1920
const MOUNTAIN_WINDOW_START = 78; // 1920
const MOUNTAIN_STAGGER = 8;
const MOUNTAIN_SPRING_DURATION = 24;

const VALLEY_WIDTH = 520;

const mountainProgress = (frame: number, fps: number, peakIndex: number) => {
	const start = MOUNTAIN_WINDOW_START + peakIndex * MOUNTAIN_STAGGER;
	const local = frame - start;
	if (local < 0) return 0;
	if (local >= MOUNTAIN_SPRING_DURATION) return 1;
	return spring({frame: local, fps, config: {damping: 11, stiffness: 140, mass: 0.7}, durationInFrames: MOUNTAIN_SPRING_DURATION});
};

export const Scene8: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const riverOpacity = interpolate(frame, RIVER_FADE_IN, [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const peakIndices = Array.from({length: MOUNTAIN_PEAK_COUNT}, (_, i) => i);
	const topProgress = peakIndices.map((i) => mountainProgress(frame, fps, i));
	const bottomProgress = peakIndices.map((i) => mountainProgress(frame, fps, i));

	const height = VALLEY_WIDTH * (600 / 334);

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{top: LAYOUT.bibleTop, alignItems: 'center'}}>
				<Img src={ASSETS.bible} style={{width: LAYOUT.bibleWidth}} />
			</AbsoluteFill>

			<AbsoluteFill style={{top: LAYOUT.contentTop, alignItems: 'center'}}>
				<div style={{position: 'relative', width: VALLEY_WIDTH, height}}>
					<Img src={ASSETS.dryValley} style={{width: VALLEY_WIDTH}} />
					<RiverOverlay width={VALLEY_WIDTH} opacity={riverOpacity} />
					<div style={{position: 'absolute', top: 0, left: 0, width: '100%'}}>
						<MountainRange edge="top" progress={topProgress} />
					</div>
					<div style={{position: 'absolute', bottom: 0, left: 0, width: '100%'}}>
						<MountainRange edge="bottom" progress={bottomProgress} />
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
