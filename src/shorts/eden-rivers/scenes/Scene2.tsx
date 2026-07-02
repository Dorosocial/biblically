import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {MiddleEastMap} from '../MiddleEastMap';
import {ASSETS, LAYOUT} from '../theme';

// VO: "And when you plot all four rivers, they all converge on a single region."
export const SCENE_2_DURATION = 174; // 5.8s @ 30fps

const DRAW_END = 144; // 288-432 global -> 0-144 local
const STARTS = {pishon: 0, gihon: 10, euphrates: 20, tigris: 30} as const;

const drawProgress = (frame: number, start: number) =>
	interpolate(frame, [start, DRAW_END], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const Scene2: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{top: LAYOUT.bibleTop, alignItems: 'center'}}>
				<Img src={ASSETS.bible} style={{width: LAYOUT.bibleWidth}} />
			</AbsoluteFill>

			<AbsoluteFill style={{top: LAYOUT.contentTop, alignItems: 'center'}}>
				<MiddleEastMap
					width={880}
					pishon={{progress: drawProgress(frame, STARTS.pishon)}}
					gihon={{progress: drawProgress(frame, STARTS.gihon)}}
					euphrates={{progress: drawProgress(frame, STARTS.euphrates)}}
					tigris={{progress: drawProgress(frame, STARTS.tigris)}}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
