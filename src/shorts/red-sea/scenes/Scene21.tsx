import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {DottedPath} from '../DottedPath';
import {ImageLayer} from '../ImageLayer';
import {pulse} from '../motion';
import {AQABA_WIDTH} from './Scene18';
import {IMAGE_ASPECT, ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "If you follow the journey in Numbers 33 step-by-step, it seems to
// lead toward this enclosed passage."
// CONTINUES from Scene 20 — mountains-corridor.png remains squeezed into
// the tight corridor composition; a dotted path steps down through the
// channel, ending on a freeze with a slow final zoom-in.
export const SCENE_21_DURATION = 270; // 9.0s @ 30fps

const SQUEEZE_X = 0.78;
const PATH_VIEWBOX = '0 0 334 600';
const PATH_D = 'M167,30 L148,115 L188,195 L146,275 L190,355 L155,435 L167,560';
const DRAW_WINDOW = [10, 210] as const;
const ZOOM_WINDOW = [220, 270] as const;

export const Scene21: React.FC = () => {
	const frame = useCurrentFrame();

	const drawProgress = interpolate(frame, DRAW_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const channelGlow = 0.85 * pulse(frame, 30, 0.15, 0.4);
	const zoomScale = interpolate(frame, ZOOM_WINDOW, [1, 1.05], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{transform: `scale(${zoomScale})`, transformOrigin: 'center center'}}>
			<Stage>
				<div style={{position: 'relative', width: AQABA_WIDTH, height: AQABA_WIDTH * IMAGE_ASPECT, transform: `scale(${SQUEEZE_X}, 1)`}}>
					<ImageLayer src={ASSETS.mountainsCorridor} width="100%" />
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
					<DottedPath d={PATH_D} viewBox={PATH_VIEWBOX} progress={drawProgress} frame={frame} strokeWidth={5} />
				</div>
			</Stage>
		</AbsoluteFill>
	);
};
