import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {pulse} from '../motion';
import {Stage} from '../Stage';
import {TextCard} from '../TextCard';

// VO: "About 7,500 years ago, sea levels were significantly lower. The
// entire northern"
// HARD RESET — nothing from Scene 10 carries over. Only the text is shown:
// a bold, text-forward scene, centered, no Bible, no map.
export const SCENE_11_DURATION = 210; // 7.0s @ 30fps

const SPRING_DURATION = 55;
const SPRING_CONFIG = {damping: 10, stiffness: 140, mass: 0.9};

export const Scene11: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = frame >= SPRING_DURATION ? 1 : spring({frame, fps, config: SPRING_CONFIG, durationInFrames: SPRING_DURATION});
	const holdPulse = frame >= SPRING_DURATION ? pulse(frame - SPRING_DURATION, fps, 0.025, 0.3) : 1;
	const scale = entrance * holdPulse;

	return (
		<Stage>
			<TextCard text="7,500 YEARS AGO" opacity={Math.min(entrance, 1)} scale={scale} fontSize={64} />
		</Stage>
	);
};
