import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ImageLayer} from '../ImageLayer';
import {breathe, pulse} from '../motion';
import {AQABA_WIDTH} from './Scene18';
import {IMAGE_ASPECT, ASSETS} from '../theme';
import {Stage} from '../Stage';

// VO: "The Gulf of Aqaba is a long, narrow stretch of water between
// mountains."
// CONTINUES from Scene 18 — map-aqaba.png dims out as mountains-corridor.png
// (mountains on both sides, framing the gap between them) fades in, with
// the narrow water channel between them glowing.
export const SCENE_19_DURATION = 150; // 5.0s @ 30fps

const CROSSFADE_WINDOW = [0, 55] as const;
const CHANNEL_GLOW_WINDOW = [30, 80] as const;

export const Scene19: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const mapOpacity = interpolate(frame, CROSSFADE_WINDOW, [1, 0.15], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const mountainsOpacity = interpolate(frame, CROSSFADE_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const contentScale = breathe(frame, fps, 0.012, 0.2);
	const channelGlow = interpolate(frame, CHANNEL_GLOW_WINDOW, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * pulse(frame, fps, 0.15, 0.4);

	return (
		<Stage>
			<div style={{position: 'relative', width: AQABA_WIDTH, height: AQABA_WIDTH * IMAGE_ASPECT}}>
				<ImageLayer src={ASSETS.mapAqaba} width="100%" left="0%" top="0%" opacity={mapOpacity} />
				<ImageLayer src={ASSETS.mountainsCorridor} width="100%" left="0%" top="0%" opacity={mountainsOpacity} scale={contentScale} />
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
						opacity: mountainsOpacity,
					}}
				/>
			</div>
		</Stage>
	);
};
