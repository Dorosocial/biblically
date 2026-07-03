import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ImageLayer} from '../ImageLayer';
import {breathe, pulse} from '../motion';
import {AQABA_WIDTH} from './Scene18';
import {IMAGE_ASPECT, ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "It feels less like an open sea and more like a tight corridor."
// CONTINUES from Scene 19 — mountains-corridor.png remains; the whole
// composition progressively compresses horizontally, squeezing the frame
// inward to emphasize the tight corridor feel.
export const SCENE_20_DURATION = 150; // 5.0s @ 30fps

const SQUEEZE_WINDOW = [0, 100] as const;

export const Scene20: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const squeezeX = interpolate(frame, SQUEEZE_WINDOW, [1, 0.78], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const breathScale = breathe(frame, fps, 0.012, 0.2);
	const channelGlow = 0.85 * pulse(frame, fps, 0.15, 0.4);

	return (
		<Stage>
			<div style={{position: 'relative', width: AQABA_WIDTH, height: AQABA_WIDTH * IMAGE_ASPECT, transform: `scale(${squeezeX}, 1)`}}>
				<ImageLayer src={ASSETS.mountainsCorridor} width="100%" scale={breathScale} />
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '8%',
						width: `${10 * channelGlow}%`,
						height: '84%',
						transform: 'translateX(-50%)',
						background: 'linear-gradient(rgba(110,136,148,0.55), rgba(110,136,148,0.12))',
						filter: 'blur(6px)',
					}}
				/>
			</div>
		</Stage>
	);
};
