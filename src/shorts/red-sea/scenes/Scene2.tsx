import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe} from '../motion';
import {ImageLayer} from '../ImageLayer';
import {PossibilityMarker} from '../PossibilityMarker';
import {MARSH_WIDTH} from './Scene1';
import {IMAGE_ASPECT, ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "This always ends up surprising a lot of people."
// CONTINUES from Scene 1 — marsh-reeds.png remains, settled at its
// scale-1.1 end state, dimmed as the question mark takes focus.
export const SCENE_2_DURATION = 90; // 3.0s @ 30fps

const QUESTION_SPRING_WINDOW = 40;

export const Scene2: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const marshScale = 1.1 * breathe(frame, fps, 0.012, 0.18);
	const questionSpring =
		frame < QUESTION_SPRING_WINDOW
			? spring({frame, fps, config: {damping: 9, stiffness: 150, mass: 0.85}, durationInFrames: QUESTION_SPRING_WINDOW})
			: 1;

	return (
		<Stage gap={30}>
			<div style={{position: 'relative', width: MARSH_WIDTH * 0.82, height: MARSH_WIDTH * 0.82 * IMAGE_ASPECT}}>
				<ImageLayer src={ASSETS.marshReeds} width="100%" opacity={0.5} scale={marshScale} />
			</div>
			<PossibilityMarker label="?" progress={questionSpring} glow={0.7} size={120} />
		</Stage>
	);
};
