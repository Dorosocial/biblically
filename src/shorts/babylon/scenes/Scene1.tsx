import {interpolate, useCurrentFrame} from 'remotion';
import {ImageLayer} from '../ImageLayer';
import {Stage} from '../Stage';
import {ASSETS} from '../theme';

// SILENT — no VO. Cold open.
export const SCENE_1_DURATION = 90; // 3.0s @ 30fps

const FADE_IN_WINDOW = [0, 30] as const;
export const RUINS_WIDTH = 640;

export const Scene1: React.FC = () => {
	const frame = useCurrentFrame();

	const opacity = interpolate(frame, FADE_IN_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	// Slow dramatic push-in across the full 3 seconds.
	const scale = interpolate(frame, [0, SCENE_1_DURATION], [1, 1.1]);

	return (
		<Stage>
			<ImageLayer src={ASSETS.ruins} width={RUINS_WIDTH} opacity={opacity} scale={scale} />
		</Stage>
	);
};
