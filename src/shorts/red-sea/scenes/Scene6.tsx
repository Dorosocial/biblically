import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe} from '../motion';
import {ImageLayer} from '../ImageLayer';
import {MapStack} from '../MapStack';
import {RippleDistortion} from '../RippleDistortion';
import {MAP_WIDTH} from './Scene5';
import {IMAGE_ASPECT, ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "story."
// CONTINUES from Scene 5 — the map settles fully; a brief static-feeling
// pause, but kept alive with a slow breathing scale for the whole 2s.
export const SCENE_6_DURATION = 60; // 2.0s @ 30fps

const RESIDUAL_SETTLE_WINDOW = [0, 25] as const;

export const Scene6: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = 1.06 * breathe(frame, fps, 0.015, 0.25);
	const residual = interpolate(frame, RESIDUAL_SETTLE_WINDOW, [0.08, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Stage>
			<MapStack width={MAP_WIDTH} aspect={IMAGE_ASPECT} scale={contentScale}>
				<RippleDistortion id="scene6-ripple" frame={frame} strength={residual}>
					<ImageLayer src={ASSETS.mapSinai} width="100%" />
				</RippleDistortion>
			</MapStack>
		</Stage>
	);
};
