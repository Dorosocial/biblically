import {interpolate, useCurrentFrame} from 'remotion';
import {ImageLayer} from '../ImageLayer';
import {RUINS_WIDTH} from './Scene1';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';

// VO: "And you can still go there today. The geography never moved"
// HARD RESET — cross-dissolve from the ancient city back to ruins.png, a
// full-circle callback to Scene 1.
export const SCENE_9_DURATION = 120; // 4.0s @ 30fps

const CROSSFADE_WINDOW = [0, 70] as const;
const DISSOLVE_WIDTH = RUINS_WIDTH * 0.85;

export const Scene9: React.FC = () => {
	const frame = useCurrentFrame();

	const cityOpacity = interpolate(frame, CROSSFADE_WINDOW, [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const ruinsOpacity = interpolate(frame, CROSSFADE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const scale = interpolate(frame, [0, SCENE_9_DURATION], [1, 1.03]);

	return (
		<Stage>
			<div style={{position: 'relative', width: DISSOLVE_WIDTH, height: DISSOLVE_WIDTH * (534 / 334)}}>
				<ImageLayer src={ASSETS.cityWall} width="100%" left="0%" top="42%" anchor="top-left" opacity={cityOpacity} scale={scale} />
				<ImageLayer src={ASSETS.ruins} width="100%" left="0%" top="0%" anchor="top-left" opacity={ruinsOpacity} scale={scale} />
			</div>
		</Stage>
	);
};
