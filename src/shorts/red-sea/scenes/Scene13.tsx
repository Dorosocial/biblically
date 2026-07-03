import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {HighlightGlow} from '../HighlightGlow';
import {ImageLayer} from '../ImageLayer';
import {Label} from '../Label';
import {MapStack} from '../MapStack';
import {SINAI_SPOT} from '../mapLayout';
import {pushIn} from '../motion';
import {MAP_WIDTH} from './Scene5';
import {IMAGE_ASPECT, ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "The exact location could be in northern Sinai."
// HARD RESET — map-sinai.png fades in, then the northern Sinai region
// highlights with a glow + label.
export const SCENE_13_DURATION = 120; // 4.0s @ 30fps

const MAP_FADE_WINDOW = [0, 40] as const;
const GLOW_SPRING_WINDOW = [30, 75] as const;

export const Scene13: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = pushIn(frame, SCENE_13_DURATION);
	const mapOpacity = interpolate(frame, MAP_FADE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const local = frame - GLOW_SPRING_WINDOW[0];
	const glowSpring =
		local < 0 ? 0 : frame >= GLOW_SPRING_WINDOW[1] ? 1 : spring({frame: local, fps, config: {damping: 11, stiffness: 130, mass: 0.9}, durationInFrames: GLOW_SPRING_WINDOW[1] - GLOW_SPRING_WINDOW[0]});

	return (
		<Stage>
			<MapStack width={MAP_WIDTH} aspect={IMAGE_ASPECT} scale={contentScale}>
				<ImageLayer src={ASSETS.mapSinai} width="100%" opacity={mapOpacity} />
				<HighlightGlow left={SINAI_SPOT.left} top={SINAI_SPOT.top} size={56} intensity={glowSpring} frame={frame} fps={fps} />
				<Label text="NORTHERN SINAI" progress={glowSpring} fontSize={28} style={{left: SINAI_SPOT.left, top: `calc(${SINAI_SPOT.top} + 14%)`, transform: 'translate(-50%, 0)'}} />
			</MapStack>
		</Stage>
	);
};
