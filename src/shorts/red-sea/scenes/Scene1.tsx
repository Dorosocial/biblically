import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {driftX, driftY} from '../motion';
import {ImageLayer} from '../ImageLayer';
import {IMAGE_ASPECT, ASSETS} from '../theme';
import {Stage} from '../Stage';

// SILENT — no VO. Cold open.
export const SCENE_1_DURATION = 150; // 5.0s @ 30fps

export const MARSH_WIDTH = 560;
const FADE_IN_WINDOW = [0, 45] as const;

const MistWisp: React.FC<{frame: number; fps: number; phase: number; top: string; size: number}> = ({frame, fps, phase, top, size}) => {
	const x = driftX(frame + phase, fps, 14, 0.1);
	const y = driftY(frame + phase, fps, 6, 0.09);
	const opacity = 0.16 + 0.07 * Math.sin((frame / fps) * 2 * Math.PI * 0.12 + phase);

	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top,
				width: size,
				height: size * 0.4,
				transform: `translate(calc(-50% + ${x}px), ${y}px)`,
				background: 'radial-gradient(ellipse, rgba(242,249,251,0.9) 0%, rgba(242,249,251,0) 72%)',
				filter: 'blur(6px)',
				opacity,
			}}
		/>
	);
};

export const Scene1: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const opacity = interpolate(frame, FADE_IN_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	// Slow dramatic push-in across the full 5 seconds.
	const scale = interpolate(frame, [0, SCENE_1_DURATION], [1, 1.1]);

	return (
		<Stage>
			<div style={{position: 'relative', width: MARSH_WIDTH, height: MARSH_WIDTH * IMAGE_ASPECT, overflow: 'hidden'}}>
				<ImageLayer src={ASSETS.marshReeds} width="100%" opacity={opacity} scale={scale} />
				<MistWisp frame={frame} fps={fps} phase={0} top="18%" size={MARSH_WIDTH * 0.9} />
				<MistWisp frame={frame} fps={fps} phase={2.4} top="34%" size={MARSH_WIDTH * 0.75} />
			</div>
		</Stage>
	);
};
