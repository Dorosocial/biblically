import {AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MiddleEastMap} from '../MiddleEastMap';
import {ASSETS, LAYOUT} from '../theme';
import {cushProgress, SCENE_STARTS} from '../timeline';

// VO: "The Pishon is described as encircling the land of Havilah which is
// a region associated in other biblical texts with the Arabian Peninsula.
// The Gihon encircles Cush,"
export const SCENE_5_DURATION = 291; // 9.7s @ 30fps

const PISHON_POP_WINDOW = [0, 70] as const;
const HAVILAH_WINDOW = [15, 90] as const;
const GIHON_POP_WINDOW = [106, 176] as const;

const POP_SPRING_CONFIG = {damping: 10, stiffness: 150, mass: 0.8};

const springProgress = (frame: number, fps: number, [start, end]: readonly [number, number]) => {
	const local = frame - start;
	if (local < 0) return 0;
	if (frame >= end) return 1;
	return spring({frame: local, fps, config: POP_SPRING_CONFIG, durationInFrames: end - start});
};

export const Scene5: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const globalFrame = frame + SCENE_STARTS.scene5;

	const pishonPop = springProgress(frame, fps, PISHON_POP_WINDOW);
	const havilahProgress = springProgress(frame, fps, HAVILAH_WINDOW);
	const gihonPop = springProgress(frame, fps, GIHON_POP_WINDOW);
	const cush = cushProgress(globalFrame);

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{top: LAYOUT.bibleTop, alignItems: 'center'}}>
				<Img src={ASSETS.bible} style={{width: LAYOUT.bibleWidth}} />
			</AbsoluteFill>

			<AbsoluteFill style={{top: LAYOUT.contentTop, alignItems: 'center'}}>
				<MiddleEastMap
					width={880}
					pishon={{progress: 1, pop: pishonPop}}
					gihon={{progress: 1, pop: gihonPop}}
					euphrates={{progress: 1, pop: 1}}
					tigris={{progress: 1, pop: 1}}
					regions={{turkey: 1, syria: 1, iraq: 1, havilah: havilahProgress, cush}}
					pin={{dropProgress: 1, pulseScale: 1 + 0.08 * Math.sin((frame / fps) * 2 * Math.PI * 1.25)}}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
