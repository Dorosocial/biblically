import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MiddleEastMap} from '../MiddleEastMap';
import {ASSETS} from '../theme';

// VO: "Genesis chapter 2 gives us the geographic location of Eden with
// four named rivers. Two of those rivers still exist on a modern map."
export const SCENE_1_DURATION = 288; // 9.6s @ 30fps

const BIBLE_SPRING_CONFIG = {damping: 12, stiffness: 110, mass: 1};
const BIBLE_SPRING_DURATION = 60; // overshoots within 0-45, settled by 60
const MAP_FADE_IN = [60, 150] as const;

// Four rivers draw in staggered by 10 frames within 150-210, each timed to
// finish right at 210 regardless of when it started.
const RIVER_DRAW_END = 210;
const RIVER_STARTS = {
	pishon: 150,
	gihon: 160,
	euphrates: 170,
	tigris: 180,
} as const;

const POP_START = 210;
const POP_DURATION = 30; // 210-240
const POP_SPRING_CONFIG = {damping: 10, stiffness: 150, mass: 0.8};

const drawProgress = (frame: number, start: number) =>
	interpolate(frame, [start, RIVER_DRAW_END], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

export const Scene1: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const bibleScale =
		frame >= BIBLE_SPRING_DURATION
			? 1
			: spring({
					frame,
					fps,
					config: BIBLE_SPRING_CONFIG,
					durationInFrames: BIBLE_SPRING_DURATION,
				});

	const mapOpacity = interpolate(frame, MAP_FADE_IN, [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const pishonProgress = drawProgress(frame, RIVER_STARTS.pishon);
	const gihonProgress = drawProgress(frame, RIVER_STARTS.gihon);
	const euphratesProgress = drawProgress(frame, RIVER_STARTS.euphrates);
	const tigrisProgress = drawProgress(frame, RIVER_STARTS.tigris);

	const popLocalFrame = frame - POP_START;
	const popProgress =
		popLocalFrame < 0
			? 0
			: frame >= POP_START + POP_DURATION
				? 1
				: spring({
						frame: popLocalFrame,
						fps,
						config: POP_SPRING_CONFIG,
						durationInFrames: POP_DURATION,
					});

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{top: 180, alignItems: 'center'}}>
				<Img
					src={ASSETS.bible}
					style={{
						width: 420,
						transform: `scale(${bibleScale})`,
						transformOrigin: 'center top',
					}}
				/>
			</AbsoluteFill>

			<AbsoluteFill style={{top: 990, alignItems: 'center', opacity: mapOpacity}}>
				<MiddleEastMap
					width={880}
					pishon={pishonProgress}
					gihon={gihonProgress}
					euphrates={{progress: euphratesProgress, pop: popProgress}}
					tigris={{progress: tigrisProgress, pop: popProgress}}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
