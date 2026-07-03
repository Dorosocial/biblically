import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';
import {EdenGlyph} from '../EdenGlyph';
import {River} from '../River';
import {GENERIC_RIVERS, GENERIC_VIEWBOX} from '../riverPaths';
import {Stage} from '../Stage';

// VO: "Genesis chapter 2 gives us the geographic location of Eden with
// four named rivers."
export const SCENE_1_DURATION = 210; // 7.0s @ 30fps

const BIBLE_SPRING_CONFIG = {damping: 12, stiffness: 110, mass: 1};
const BIBLE_SPRING_DURATION = 50;

const EDEN_START = 35;
const EDEN_SPRING_CONFIG = {damping: 11, stiffness: 130, mass: 0.9};
const EDEN_SPRING_DURATION = 55;

const RIVER_A_WINDOW = [75, 175] as const;
const RIVER_B_WINDOW = [95, 195] as const;

const springProgress = (frame: number, fps: number, start: number, duration: number, config: {damping: number; stiffness: number; mass: number}) => {
	const local = frame - start;
	if (local < 0) return 0;
	if (frame >= start + duration) return 1;
	return spring({frame: local, fps, config, durationInFrames: duration});
};

export const Scene1: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const bibleSpring =
		frame >= BIBLE_SPRING_DURATION ? 1 : spring({frame, fps, config: BIBLE_SPRING_CONFIG, durationInFrames: BIBLE_SPRING_DURATION});
	const edenSpring = springProgress(frame, fps, EDEN_START, EDEN_SPRING_DURATION, EDEN_SPRING_CONFIG);
	const edenOpacity = Math.min(edenSpring, 1);

	const riverAProgress = interpolate(frame, RIVER_A_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const riverBProgress = interpolate(frame, RIVER_B_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Stage gap={40}>
			<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20}}>
				<BibleLayer frame={frame} fps={fps} entranceScale={bibleSpring} />
				<div style={{opacity: edenOpacity, transform: `scale(${interpolate(edenSpring, [0, 1], [0.4, 1])})`}}>
					<EdenGlyph frame={frame} fps={fps} size={160} />
				</div>
			</div>
			<div style={{position: 'relative', width: 320, height: (320 * 100) / 240}}>
				<River d={GENERIC_RIVERS.a} viewBox={GENERIC_VIEWBOX} progress={riverAProgress} frame={frame} strokeWidth={4} />
				<River d={GENERIC_RIVERS.b} viewBox={GENERIC_VIEWBOX} progress={riverBProgress} frame={frame} strokeWidth={4} />
			</div>
		</Stage>
	);
};
