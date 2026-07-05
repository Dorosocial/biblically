import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe} from '../motion';
import {SceneImage} from '../SceneImage';
import {ASSETS} from '../theme';

// Beat 20 (frames 2640-2760): statistics-fade.png dissolves out as
// ghost-widows.png strengthens beneath it — the data abstraction giving way
// to the human reality it represents.
export const SHOT_J_DURATION = 120; // 4.0s @ 30fps

export const ShotJ_StatsCrossfade: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = breathe(frame, fps, 0.01, 0.15);
	const statsOpacity = interpolate(frame, [0, SHOT_J_DURATION], [1, 0]);
	const figuresOpacity = interpolate(frame, [0, SHOT_J_DURATION], [0.45, 1]);

	return (
		<AbsoluteFill>
			<SceneImage src={ASSETS.ghostWidows} opacity={figuresOpacity} scale={scale} />
			<SceneImage src={ASSETS.statisticsFade} opacity={statsOpacity} />
		</AbsoluteFill>
	);
};
