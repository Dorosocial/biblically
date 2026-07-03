import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PossibilityMarker} from '../PossibilityMarker';
import {Stage} from '../Stage';
import {TextCard} from '../TextCard';

// VO: "And that leaves us with two unsettling possibilities when it comes
// to this whole story."
// HARD RESET — nothing carries over. Bold headline text springs in, then
// two glowing marker placeholders pop in side by side underneath.
export const SCENE_11_DURATION = 150; // 5.0s @ 30fps

const TEXT_SPRING_DURATION = 45;
const MARKER_DELAYS = [40, 58] as const;
const MARKER_SPRING_DURATION = 40;

const markerSpring = (frame: number, fps: number, delay: number) => {
	const local = frame - delay;
	if (local < 0) return 0;
	if (local >= MARKER_SPRING_DURATION) return 1;
	return spring({frame: local, fps, config: {damping: 10, stiffness: 150, mass: 0.85}, durationInFrames: MARKER_SPRING_DURATION});
};

export const Scene11: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const textSpring = frame >= TEXT_SPRING_DURATION ? 1 : spring({frame, fps, config: {damping: 11, stiffness: 130, mass: 0.8}, durationInFrames: TEXT_SPRING_DURATION});

	return (
		<Stage gap={40}>
			<TextCard text="TWO POSSIBILITIES" opacity={Math.min(textSpring, 1)} scale={textSpring} fontSize={48} />
			<div style={{display: 'flex', gap: 60}}>
				<PossibilityMarker label="1" progress={markerSpring(frame, fps, MARKER_DELAYS[0])} glow={0.5} />
				<PossibilityMarker label="2" progress={markerSpring(frame, fps, MARKER_DELAYS[1])} glow={0.5} />
			</div>
		</Stage>
	);
};
