import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {pulse} from '../motion';
import {PossibilityMarker} from '../PossibilityMarker';
import {Stage} from '../Stage';
import {TextCard} from '../TextCard';

// VO: "The first one."
// CONTINUES from Scene 11 — both markers remain; the left one brightens as
// "the first one" is named, the right one dims back.
export const SCENE_12_DURATION = 90; // 3.0s @ 30fps

const SHIFT_WINDOW = [0, 45] as const;

export const Scene12: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const leftGlow = interpolate(frame, SHIFT_WINDOW, [0.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * pulse(frame, fps, 0.06, 0.5);
	const rightGlow = interpolate(frame, SHIFT_WINDOW, [0.5, 0.12], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Stage gap={40}>
			<TextCard text="TWO POSSIBILITIES" opacity={1} fontSize={48} />
			<div style={{display: 'flex', gap: 60}}>
				<PossibilityMarker label="1" progress={1} glow={leftGlow} />
				<PossibilityMarker label="2" progress={1} glow={rightGlow} />
			</div>
		</Stage>
	);
};
