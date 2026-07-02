import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MiddleEastMap} from '../MiddleEastMap';
import {ASSETS} from '../theme';

// VO: "Genesis chapter 2 gives us the geographic location of Eden with
// four named rivers. Two of those rivers still exist on a modern map."
export const SCENE_1_DURATION = 288; // 9.6s @ 30fps

const BIBLE_SPRING_CONFIG = {damping: 12, stiffness: 110, mass: 1};
const BIBLE_SPRING_DURATION = 60; // overshoots within 0-45, settled by 60
const MAP_FADE_IN = [90, 150] as const;

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
				<MiddleEastMap width={880} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
