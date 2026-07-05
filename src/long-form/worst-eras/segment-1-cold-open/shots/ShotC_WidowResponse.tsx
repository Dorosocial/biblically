import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe, driftX} from '../motion';
import {SceneImage} from '../SceneImage';
import {ASSETS} from '../theme';

// Beat 5 (frames 450-570): hard cut to the widow protesting/responding to
// Elijah, continuous subtle drift.
export const SHOT_C_DURATION = 120; // 4.0s @ 30fps

export const ShotC_WidowResponse: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = breathe(frame, fps, 0.01, 0.2);
	const offsetX = driftX(frame, fps, 4, 0.13);

	return (
		<AbsoluteFill>
			<SceneImage src={ASSETS.widowResponseScene} scale={scale} offsetX={offsetX} />
		</AbsoluteFill>
	);
};
