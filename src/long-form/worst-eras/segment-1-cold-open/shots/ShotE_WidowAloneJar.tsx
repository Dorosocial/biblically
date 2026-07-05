import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe, driftY} from '../motion';
import {SceneImage} from '../SceneImage';
import {ASSETS} from '../theme';

// Beats 8 (870-1110) + 9 (1110-1230) + 10 (1230-1350): the widow alone,
// clutching the jar. One continuous 16s shot — idle breathing runs
// throughout; a slow dim starts at beat 9 and holds at its darkest through
// beat 10's silent hold, all without any Sequence/motion restart.
export const SHOT_E_DURATION = 480; // 16.0s @ 30fps

const DIM_START = 240; // local frame = 1110 absolute (beat 9 start)
const DIM_END = 360; // local frame = 1230 absolute (beat 10 start)
const DIM_TARGET_BRIGHTNESS = 0.55;

export const ShotE_WidowAloneJar: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = breathe(frame, fps, 0.01, 0.16);
	const offsetY = driftY(frame, fps, 2.5, 0.13);
	const brightness = interpolate(frame, [DIM_START, DIM_END], [1, DIM_TARGET_BRIGHTNESS], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<SceneImage src={ASSETS.widowAloneJar} scale={scale} offsetY={offsetY} brightness={brightness} />
		</AbsoluteFill>
	);
};
