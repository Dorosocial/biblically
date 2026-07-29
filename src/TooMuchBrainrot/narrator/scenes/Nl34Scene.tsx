import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, HEIGHT} from '../../constants';
import {NarratorFigureBack} from '../NarratorFigureBack';
import {WARM_GLOW} from '../palette';

interface Props {
	durationInFrames: number;
}

// Local feet y in NarratorFigureBack's coordinate space (hip 228 + leg 160).
const LOCAL_FEET_Y = 388;

// Walking away toward a warm glow on the horizon — the closing image. Large
// and close at the start, still a clear presence (not tiny) by the end.
export const Nl34Scene: React.FC<Props> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const scale = interpolate(progress, [0, 1], [2.55, 1.15]);
	const groundY = interpolate(progress, [0, 1], [HEIGHT * 0.98, HEIGHT * 0.66]);
	const translateY = groundY - LOCAL_FEET_Y * scale;
	const strideT = (frame / (fps * 0.9)) % 1;
	const glowRadius = 100 + progress * 90;

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<circle
				cx={CENTER_X}
				cy={HEIGHT * 0.4}
				r={glowRadius}
				fill={WARM_GLOW}
				opacity={0.25 + progress * 0.25}
			/>
			<g transform={`translate(${CENTER_X}, ${translateY}) scale(${scale})`}>
				<NarratorFigureBack strideT={strideT} />
			</g>
		</svg>
	);
};
