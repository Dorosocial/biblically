import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe} from '../motion';
import {Stage} from '../Stage';
import {StrikeThrough} from '../StrikeThrough';
import {TextCard} from '../TextCard';

// VO: "The Bible doesn't actually say Red Sea."
// HARD RESET — nothing carries over. Bold "RED SEA" text springs in, then
// gets struck through as the VO debunks it.
export const SCENE_3_DURATION = 150; // 5.0s @ 30fps

const TEXT_SPRING_DURATION = 45;
const STRIKE_WINDOW = [70, 110] as const;

export const Scene3: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const textSpring =
		frame < TEXT_SPRING_DURATION
			? spring({frame, fps, config: {damping: 11, stiffness: 130, mass: 0.8}, durationInFrames: TEXT_SPRING_DURATION})
			: 1;
	const textScale = interpolate(textSpring, [0, 1], [0.6, 1]) * breathe(frame, fps, 0.012, 0.22);
	const textOpacity = interpolate(frame, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const strikeProgress = interpolate(frame, STRIKE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Stage>
			<div style={{position: 'relative'}}>
				<TextCard text="RED SEA" opacity={textOpacity} scale={textScale} fontSize={104} />
				<StrikeThrough progress={strikeProgress} width={640} height={140} />
			</div>
		</Stage>
	);
};
