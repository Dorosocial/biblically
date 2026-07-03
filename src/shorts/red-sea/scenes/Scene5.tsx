import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe, pushIn} from '../motion';
import {ImageLayer} from '../ImageLayer';
import {MapStack} from '../MapStack';
import {RippleDistortion} from '../RippleDistortion';
import {IMAGE_ASPECT, ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "And if this one translation is what it is, then it changes the
// entire geography of this"
// HARD RESET — map-sinai.png fades in with a ripple/shift distortion,
// selling the idea that the geography itself is shifting underneath us.
export const SCENE_5_DURATION = 210; // 7.0s @ 30fps

export const MAP_WIDTH = 460;
const FADE_WINDOW = [0, 50] as const;
const SETTLE_WINDOW = [90, 180] as const;

export const Scene5: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const opacity = interpolate(frame, FADE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const contentScale = pushIn(frame, SCENE_5_DURATION, 1, 1.06);
	const settle = interpolate(frame, SETTLE_WINDOW, [1, 0.08], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const strength = settle * (0.6 + 0.4 * breathe(frame, fps, 1, 0.5));

	return (
		<Stage>
			<MapStack width={MAP_WIDTH} aspect={IMAGE_ASPECT} scale={contentScale}>
				<RippleDistortion id="scene5-ripple" frame={frame} strength={strength}>
					<ImageLayer src={ASSETS.mapSinai} width="100%" opacity={opacity} />
				</RippleDistortion>
			</MapStack>
		</Stage>
	);
};
