import {AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MiddleEastMap} from '../MiddleEastMap';
import {ASSETS, LAYOUT} from '../theme';

// VO: "Genesis 2:10 to 14 explicitly mentions the Tigris and Euphrates"
export const SCENE_3_DURATION = 141; // 4.7s @ 30fps

const POP_SPRING_CONFIG = {damping: 10, stiffness: 150, mass: 0.8};
const EUPHRATES_POP_WINDOW = [0, 45] as const;
const TIGRIS_POP_WINDOW = [15, 60] as const;

const popProgress = (frame: number, fps: number, [start, end]: readonly [number, number]) => {
	const local = frame - start;
	if (local < 0) return 0;
	if (frame >= end) return 1;
	return spring({frame: local, fps, config: POP_SPRING_CONFIG, durationInFrames: end - start});
};

export const Scene3: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const euphratesPop = popProgress(frame, fps, EUPHRATES_POP_WINDOW);
	const tigrisPop = popProgress(frame, fps, TIGRIS_POP_WINDOW);

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
					euphrates={{progress: 1, pop: euphratesPop}}
					tigris={{progress: 1, pop: tigrisPop}}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
