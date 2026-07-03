import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {HighlightGlow} from '../HighlightGlow';
import {ImageLayer} from '../ImageLayer';
import {Label} from '../Label';
import {MapStack} from '../MapStack';
import {NILE_DELTA_SPOT, SINAI_SPOT} from '../mapLayout';
import {breathe} from '../motion';
import {MAP_WIDTH} from './Scene5';
import {IMAGE_ASPECT, ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "Nile Delta."
// CONTINUES from Scene 14 — map + Sinai highlight remain (dimmed as focus
// shifts); the Nile Delta area highlights and labels in.
export const SCENE_15_DURATION = 60; // 2.0s @ 30fps

const GLOW_SPRING_DURATION = 32;

export const Scene15: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const contentScale = breathe(frame, fps, 0.012, 0.2);
	const glowSpring = frame >= GLOW_SPRING_DURATION ? 1 : spring({frame, fps, config: {damping: 10, stiffness: 150, mass: 0.85}, durationInFrames: GLOW_SPRING_DURATION});

	return (
		<Stage>
			<MapStack width={MAP_WIDTH} aspect={IMAGE_ASPECT} scale={contentScale}>
				<ImageLayer src={ASSETS.mapSinai} width="100%" />
				<HighlightGlow left={SINAI_SPOT.left} top={SINAI_SPOT.top} size={50} intensity={0.35} frame={frame} fps={fps} />
				<ImageLayer src={ASSETS.marshReeds} width="34%" left={SINAI_SPOT.left} top={SINAI_SPOT.top} anchor="center" opacity={0.4} />
				<HighlightGlow left={NILE_DELTA_SPOT.left} top={NILE_DELTA_SPOT.top} size={44} intensity={glowSpring} frame={frame} fps={fps} />
				<Label text="NILE DELTA" progress={glowSpring} fontSize={20} style={{left: NILE_DELTA_SPOT.left, top: `calc(${NILE_DELTA_SPOT.top} + 13%)`, transform: 'translate(-50%, 0)'}} />
			</MapStack>
		</Stage>
	);
};
