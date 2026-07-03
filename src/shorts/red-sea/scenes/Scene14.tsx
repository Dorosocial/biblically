import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {HighlightGlow} from '../HighlightGlow';
import {ImageLayer} from '../ImageLayer';
import {Label} from '../Label';
import {MapStack} from '../MapStack';
import {SINAI_SPOT} from '../mapLayout';
import {breathe} from '../motion';
import {MAP_WIDTH} from './Scene5';
import {IMAGE_ASPECT, ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "This is a swampy, reed-filled area with shallow water and muddy
// ground near the edge of the"
// CONTINUES from Scene 13 — map + Sinai highlight remain; a marsh-reeds
// texture overlay fades in on top of the highlighted region.
export const SCENE_14_DURATION = 210; // 7.0s @ 30fps

const TEXTURE_FADE_WINDOW = [0, 70] as const;

export const Scene14: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = 1 * breathe(frame, fps, 0.012, 0.2);
	const textureOpacity = interpolate(frame, TEXTURE_FADE_WINDOW, [0, 0.75], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Stage>
			<MapStack width={MAP_WIDTH} aspect={IMAGE_ASPECT} scale={contentScale}>
				<ImageLayer src={ASSETS.mapSinai} width="100%" />
				<HighlightGlow left={SINAI_SPOT.left} top={SINAI_SPOT.top} size={58} intensity={1} frame={frame} fps={fps} />
				<Label text="NORTHERN SINAI" progress={1} fontSize={28} style={{left: SINAI_SPOT.left, top: `calc(${SINAI_SPOT.top} + 14%)`, transform: 'translate(-50%, 0)'}} />
				<ImageLayer
					src={ASSETS.marshReeds}
					width="34%"
					left={SINAI_SPOT.left}
					top={SINAI_SPOT.top}
					anchor="center"
					opacity={textureOpacity}
				/>
			</MapStack>
		</Stage>
	);
};
