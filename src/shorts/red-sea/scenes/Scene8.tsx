import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe, pushIn} from '../motion';
import {ImageLayer} from '../ImageLayer';
import {OPEN_SEA_WIDTH} from './Scene7';
import {IMAGE_ASPECT, ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "It sounds like shallow water, tangled marshes, and dense reeds
// rising from the mud where"
// CONTINUES from Scene 7 — open-sea.png fades out as marsh-reeds.png
// builds in bottom-up, like reeds rising out of the mud.
export const SCENE_8_DURATION = 240; // 8.0s @ 30fps

const OPEN_SEA_FADE_WINDOW = [0, 60] as const;
const RISE_WINDOW = [30, 160] as const;
const MARSH_WIDTH = 780;

export const Scene8: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const openSeaOpacity = interpolate(frame, OPEN_SEA_FADE_WINDOW, [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const riseReveal = interpolate(frame, RISE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const marshOpacity = interpolate(frame, [RISE_WINDOW[0], RISE_WINDOW[0] + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const contentScale = pushIn(frame, SCENE_8_DURATION, 1, 1.04) * breathe(frame, fps, 0.01, 0.2);

	return (
		<Stage>
			<div style={{position: 'relative', width: Math.max(OPEN_SEA_WIDTH, MARSH_WIDTH), height: MARSH_WIDTH * IMAGE_ASPECT}}>
				{openSeaOpacity > 0.01 && (
					<div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: OPEN_SEA_WIDTH}}>
						<ImageLayer src={ASSETS.openSea} width="100%" opacity={openSeaOpacity} />
					</div>
				)}
				<div style={{position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${contentScale})`, width: MARSH_WIDTH}}>
					<ImageLayer src={ASSETS.marshReeds} width="100%" opacity={marshOpacity} riseReveal={riseReveal} />
				</div>
			</div>
		</Stage>
	);
};
