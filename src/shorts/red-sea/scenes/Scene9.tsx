import {interpolate, useCurrentFrame} from 'remotion';
import {ImageLayer} from '../ImageLayer';
import {RippleDistortion} from '../RippleDistortion';
import {ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "land and water blur into one another."
// CONTINUES from Scene 8 — marsh-reeds.png remains fully built in; a blur/
// dissolve ripple sweeps across it once, cresting mid-scene, to sell the
// land/water boundary dissolving.
export const SCENE_9_DURATION = 120; // 4.0s @ 30fps

const MARSH_WIDTH = 500;
const SWEEP_KEYFRAMES = [0, 55, 120] as const;
const SWEEP_VALUES = [0.15, 0.85, 0.15] as const;

export const Scene9: React.FC = () => {
	const frame = useCurrentFrame();

	const strength = interpolate(frame, SWEEP_KEYFRAMES, SWEEP_VALUES, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const blurPx = interpolate(strength, [0.15, 0.85], [0, 2.5]);

	return (
		<Stage>
			<div style={{width: MARSH_WIDTH, filter: `blur(${blurPx}px)`}}>
				<RippleDistortion id="scene9-ripple" frame={frame} strength={strength}>
					<ImageLayer src={ASSETS.marshReeds} width="100%" />
				</RippleDistortion>
			</div>
		</Stage>
	);
};
