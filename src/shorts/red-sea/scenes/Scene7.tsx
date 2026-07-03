import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe} from '../motion';
import {ImageLayer} from '../ImageLayer';
import {StrikeThrough} from '../StrikeThrough';
import {ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "The Sea of Reeds doesn't sound like an open sea."
// HARD RESET — open-sea.png springs in, then gets struck through/negated.
export const SCENE_7_DURATION = 150; // 5.0s @ 30fps

export const OPEN_SEA_WIDTH = 460;
const SPRING_DURATION = 45;
const STRIKE_WINDOW = [70, 115] as const;

export const Scene7: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = frame >= SPRING_DURATION ? 1 : spring({frame, fps, config: {damping: 10, stiffness: 140, mass: 0.9}, durationInFrames: SPRING_DURATION});
	const scale = entrance * breathe(frame, fps, 0.014, 0.2);
	const strikeProgress = interpolate(frame, STRIKE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Stage>
			<div style={{position: 'relative', width: OPEN_SEA_WIDTH}}>
				<ImageLayer src={ASSETS.openSea} width="100%" opacity={Math.min(entrance, 1)} scale={scale} />
				<StrikeThrough progress={strikeProgress} width={OPEN_SEA_WIDTH * 0.9} height={OPEN_SEA_WIDTH * 0.5} />
			</div>
		</Stage>
	);
};
