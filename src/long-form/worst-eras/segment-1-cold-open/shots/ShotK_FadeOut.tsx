import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {breathe} from '../motion';
import {SceneImage} from '../SceneImage';
import {FadeToBlack} from '../FadeToBlack';
import {ASSETS} from '../theme';

// Beat 21 (frames 2760-2880): famine-landscape.png returns, then the whole
// frame fades to black across the full final 4s — the segment's transition
// out.
export const SHOT_K_DURATION = 120; // 4.0s @ 30fps

export const ShotK_FadeOut: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = breathe(frame, fps, 0.008, 0.1);
	const blackOpacity = interpolate(frame, [0, SHOT_K_DURATION], [0, 1]);

	return (
		<AbsoluteFill>
			<SceneImage src={ASSETS.famineLandscape} scale={scale} />
			<FadeToBlack opacity={blackOpacity} />
		</AbsoluteFill>
	);
};
