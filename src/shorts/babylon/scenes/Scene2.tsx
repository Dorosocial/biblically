import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ImageLayer} from '../ImageLayer';
import {breathe} from '../motion';
import {RUINS_WIDTH} from './Scene1';
import {Stage} from '../Stage';
import {StrikeThrough} from '../StrikeThrough';
import {TextCard} from '../TextCard';
import {ASSETS} from '../theme';

// VO: "A lot of people think Babylon vanished, but it didn't. In fact,
// it's still in the exact same place it's always been."
// CONTINUES from Scene 1 — ruins.png remains, settled at its scale-1.1 end state.
export const SCENE_2_DURATION = 210; // 7.0s @ 30fps

const TEXT_SPRING_DURATION = 45;
const STRIKE_WINDOW = [60, 90] as const; // global 150-180, "but it didn't"

export const Scene2: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const ruinsScale = 1.1 * breathe(frame, fps, 0.012, 0.18);

	const textSpring =
		frame < TEXT_SPRING_DURATION
			? spring({frame, fps, config: {damping: 11, stiffness: 130, mass: 0.8}, durationInFrames: TEXT_SPRING_DURATION})
			: 1;
	const textScale = interpolate(textSpring, [0, 1], [0.6, 1]);
	const textOpacity = interpolate(frame, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const strikeProgress = interpolate(frame, STRIKE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Stage gap={30}>
			<ImageLayer src={ASSETS.ruins} width={RUINS_WIDTH * 0.82} scale={ruinsScale} />
			<div style={{position: 'relative'}}>
				<TextCard text="BABYLON VANISHED?" opacity={textOpacity} scale={textScale} fontSize={44} />
				<StrikeThrough progress={strikeProgress} width={380} height={80} />
			</div>
		</Stage>
	);
};
