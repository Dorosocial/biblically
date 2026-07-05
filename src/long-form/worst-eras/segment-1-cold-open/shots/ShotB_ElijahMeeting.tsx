import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe, driftX, driftY} from '../motion';
import {SceneImage} from '../SceneImage';
import {ASSETS} from '../theme';

// Beats 3 (frames 210-330) + 4 (frames 330-450): hard cut in on Elijah
// approaching the widow, then held with idle sway on both figures. One
// continuous shot so the drift/sway never restarts at the 330 boundary.
export const SHOT_B_DURATION = 240; // 8.0s @ 30fps

export const ShotB_ElijahMeeting: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = breathe(frame, fps, 0.012, 0.18);
	const offsetX = driftX(frame, fps, 4, 0.11);
	const offsetY = driftY(frame, fps, 3, 0.14);

	return (
		<AbsoluteFill>
			<SceneImage src={ASSETS.elijahWidowMeeting} scale={scale} offsetX={offsetX} offsetY={offsetY} />
		</AbsoluteFill>
	);
};
