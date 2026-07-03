import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BibleLayer} from '../BibleLayer';

// VO: "Genesis chapter 2 gives us the geographic location of Eden with
// four named rivers."
export const SCENE_1_DURATION = 210; // 7.0s @ 30fps

const BIBLE_SPRING_CONFIG = {damping: 12, stiffness: 110, mass: 1};
const BIBLE_SPRING_DURATION = 50;

export const Scene1: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entranceScale =
		frame >= BIBLE_SPRING_DURATION
			? 1
			: spring({frame, fps, config: BIBLE_SPRING_CONFIG, durationInFrames: BIBLE_SPRING_DURATION});

	return (
		<AbsoluteFill>
			<BibleLayer frame={frame} fps={fps} entranceScale={entranceScale} />
		</AbsoluteFill>
	);
};
