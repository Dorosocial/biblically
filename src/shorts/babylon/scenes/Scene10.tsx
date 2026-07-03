import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ImageLayer} from '../ImageLayer';
import {MapStack} from '../MapStack';
import {River} from '../River';
import {RUINS_EUPHRATES, RUINS_VIEWBOX} from '../riverPaths';
import {RUINS_WIDTH} from './Scene1';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';

// VO: "and the Euphrates still runs right past those ruins."
// CONTINUES from Scene 9 — ruins.png remains.
export const SCENE_10_DURATION = 180; // 6.0s @ 30fps

const RIVER_DRAW_WINDOW = [0, 90] as const;
const ZOOM_WINDOW = [130, 180] as const;
const RUINS_ASPECT = 534 / 334;

export const Scene10: React.FC = () => {
	const frame = useCurrentFrame();

	const riverProgress = interpolate(frame, RIVER_DRAW_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const zoomScale = interpolate(frame, ZOOM_WINDOW, [1, 1.05], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{transform: `scale(${zoomScale})`, transformOrigin: 'center center'}}>
			<Stage>
				<MapStack width={RUINS_WIDTH * 0.85} aspect={RUINS_ASPECT}>
					<ImageLayer src={ASSETS.ruins} width="100%" />
					<River d={RUINS_EUPHRATES} viewBox={RUINS_VIEWBOX} progress={riverProgress} frame={frame} strokeWidth={2.4} glow={0.4} />
				</MapStack>
			</Stage>
		</AbsoluteFill>
	);
};
