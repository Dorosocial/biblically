import {interpolate, useCurrentFrame} from 'remotion';
import {DottedPath} from '../DottedPath';
import {ImageLayer} from '../ImageLayer';
import {RippleDistortion} from '../RippleDistortion';
import {IMAGE_ASPECT, ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "More like a wet, shifting land where paths can disappear."
// CONTINUES from Scene 16 — marsh-reeds.png takes over again, rippling/
// shifting continuously; a dotted path line draws in through it, then
// fades away — a path that disappears, per the line.
export const SCENE_17_DURATION = 150; // 5.0s @ 30fps

const MARSH_WIDTH = 460;
const PATH_VIEWBOX = '0 0 334 600';
const PATH_D = 'M120,50 C190,150 85,230 165,320 C230,395 105,465 150,560';
const DRAW_WINDOW = [15, 95] as const;
const PATH_FADE_WINDOW = [105, 145] as const;

export const Scene17: React.FC = () => {
	const frame = useCurrentFrame();

	const strength = 0.3 + 0.15 * Math.sin((frame / 30) * 2 * Math.PI * 0.3);
	const drawProgress = interpolate(frame, DRAW_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const pathOpacity = interpolate(frame, PATH_FADE_WINDOW, [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Stage>
			<div style={{position: 'relative', width: MARSH_WIDTH, height: MARSH_WIDTH * IMAGE_ASPECT}}>
				<RippleDistortion id="scene17-ripple" frame={frame} strength={strength}>
					<ImageLayer src={ASSETS.marshReeds} width="100%" />
				</RippleDistortion>
				<DottedPath d={PATH_D} viewBox={PATH_VIEWBOX} progress={drawProgress} frame={frame} opacity={pathOpacity} strokeWidth={5} />
			</div>
		</Stage>
	);
};
