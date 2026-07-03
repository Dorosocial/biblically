import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ImageLayer} from '../ImageLayer';
import {ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "Almost like a landscape that can swallow footsteps and erase
// direction in a matter of minutes."
// CONTINUES from Scene 9 — marsh-reeds.png remains, dimmed, behind a trail
// of footprints that walk in then sink, followed by a compass that spins
// erratically as if direction itself has stopped meaning anything.
export const SCENE_10_DURATION = 210; // 7.0s @ 30fps

const STEPS = [
	{delay: 0, x: -70, y: 55, rotate: -10, scale: 0.85},
	{delay: 22, x: 10, y: 0, rotate: 8, scale: 1},
	{delay: 44, x: 95, y: -55, rotate: -6, scale: 0.9},
] as const;

const SINK_WINDOW = [110, 165] as const;
const COMPASS_FADE_WINDOW = [125, 175] as const;

const Footstep: React.FC<{frame: number; fps: number; sink: number; step: (typeof STEPS)[number]}> = ({frame, fps, sink, step}) => {
	const local = frame - step.delay;
	if (local < 0) return null;
	const springIn = local >= 30 ? 1 : spring({frame: local, fps, config: {damping: 12, stiffness: 150, mass: 0.7}, durationInFrames: 30});
	const opacity = Math.min(springIn, 1) * (1 - sink);

	return (
		<ImageLayer
			src={ASSETS.footprint}
			width={130}
			left="50%"
			top="50%"
			anchor="center"
			opacity={opacity}
			scale={step.scale * springIn}
			rotate={step.rotate}
			offsetX={step.x}
			offsetY={step.y + sink * 70}
		/>
	);
};

export const Scene10: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const marshOpacity = 0.28;
	const sink = interpolate(frame, SINK_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const compassOpacity = interpolate(frame, COMPASS_FADE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const compassLocal = Math.max(0, frame - COMPASS_FADE_WINDOW[0]);
	const compassScale = interpolate(frame, COMPASS_FADE_WINDOW, [0.7, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	// Steady spin plus two incommensurate sine jitters — reads as the needle
	// (baked into the same cutout) losing any fixed direction.
	const rotate =
		compassLocal * 2.4 +
		14 * Math.sin((compassLocal / fps) * 2 * Math.PI * 0.35) +
		8 * Math.sin((compassLocal / fps) * 2 * Math.PI * 0.9 + 1.3);

	return (
		<Stage>
			<div style={{position: 'relative', width: 500, height: 500 * (600 / 334)}}>
				<ImageLayer src={ASSETS.marshReeds} width="100%" opacity={marshOpacity} />

				{STEPS.map((step, i) => (
					<Footstep key={i} frame={frame} fps={fps} sink={sink} step={step} />
				))}

				{compassOpacity > 0.01 && (
					<ImageLayer
						src={ASSETS.compass}
						width={190}
						left="50%"
						top="50%"
						anchor="center"
						opacity={compassOpacity}
						scale={compassScale}
						rotate={rotate}
						glow={0.35}
					/>
				)}
			</div>
		</Stage>
	);
};
