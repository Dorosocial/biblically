import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe, driftX} from '../motion';
import {SceneImage} from '../SceneImage';
import {ASSETS} from '../theme';

// Beat 11 (frames 1350-1470): cut back to Elijah and the widow, continuous
// subtle drift.
export const SHOT_F_DURATION = 120; // 4.0s @ 30fps

export const ShotF_ElijahReturn: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = breathe(frame, fps, 0.011, 0.17);
	const offsetX = driftX(frame, fps, 4, 0.1);

	return (
		<AbsoluteFill>
			<SceneImage src={ASSETS.elijahWidowMeeting} scale={scale} offsetX={offsetX} />
		</AbsoluteFill>
	);
};
