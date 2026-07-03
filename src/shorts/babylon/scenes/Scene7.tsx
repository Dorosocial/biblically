import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ImageLayer} from '../ImageLayer';
import {breathe, pushIn} from '../motion';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';

// VO: "Nebuchadnezzar understood this, which is why Babylon grew to over
// 10 square kilometres,"
// HARD RESET.
export const SCENE_7_DURATION = 240; // 8.0s @ 30fps

const NEB_WIDTH = 340;
const CITY_WIDTH = 560;
const NEB_SPRING_WINDOW = [0, 55] as const;
const CITY_SPRING_WINDOW = [45, 110] as const;

const springProgress = (frame: number, fps: number, [start, end]: readonly [number, number]) => {
	const local = frame - start;
	if (local < 0) return 0;
	if (frame >= end) return 1;
	return spring({frame: local, fps, config: {damping: 10, stiffness: 140, mass: 0.9}, durationInFrames: end - start});
};

export const Scene7: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_7_DURATION);
	const nebProgress = springProgress(frame, fps, NEB_SPRING_WINDOW);
	const cityProgress = springProgress(frame, fps, CITY_SPRING_WINDOW);

	const idleScale = frame >= CITY_SPRING_WINDOW[1] ? breathe(frame, fps, 0.012, 0.18) : 1;

	return (
		<Stage gap={20} style={{transform: `scale(${contentScale})`}}>
			<ImageLayer src={ASSETS.nebuchadnezzar} width={NEB_WIDTH} opacity={nebProgress} scale={nebProgress * idleScale} />
			<ImageLayer src={ASSETS.citySilhouette} width={CITY_WIDTH} opacity={cityProgress} scale={cityProgress * idleScale} />
		</Stage>
	);
};
