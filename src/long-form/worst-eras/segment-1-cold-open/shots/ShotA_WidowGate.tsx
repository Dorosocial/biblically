import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe, driftY, pushIn} from '../motion';
import {SceneImage} from '../SceneImage';
import {ASSETS} from '../theme';

// Beats 1 (frames 0-120) + 2 (frames 120-210): the widow gathering sticks
// outside the city gate. One continuous shot — beat 2 is the same push-in
// continuing (narratively, it's the moment she rises to answer Elijah), so
// the camera motion must not reset at the 120 boundary.
export const SHOT_A_DURATION = 210; // 7.0s @ 30fps

export const ShotA_WidowGate: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = pushIn(frame, SHOT_A_DURATION, 1, 1.06) * breathe(frame, fps, 0.006, 0.22);
	const offsetY = driftY(frame, fps, 3, 0.1);

	return (
		<AbsoluteFill>
			<SceneImage src={ASSETS.widowGateScene} scale={scale} offsetY={offsetY} />
		</AbsoluteFill>
	);
};
