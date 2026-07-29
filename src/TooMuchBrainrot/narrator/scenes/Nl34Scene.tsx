import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, HEIGHT} from '../../constants';
import {NarratorFigureBack} from '../NarratorFigureBack';
import {WARM_GLOW} from '../palette';

interface Props {
	durationInFrames: number;
}

// Walking away toward a warm glow on the horizon — the closing image.
export const Nl34Scene: React.FC<Props> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const scale = interpolate(progress, [0, 1], [3.2, 1.6]);
	const groundY = interpolate(progress, [0, 1], [HEIGHT * 0.82, HEIGHT * 0.58]);
	const strideT = (frame / (fps * 0.9)) % 1;
	const glowRadius = 90 + progress * 60;

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<circle
				cx={CENTER_X}
				cy={HEIGHT * 0.42}
				r={glowRadius}
				fill={WARM_GLOW}
				opacity={0.25 + progress * 0.2}
			/>
			<g transform={`translate(${CENTER_X}, ${groundY}) scale(${scale})`}>
				<NarratorFigureBack strideT={strideT} />
			</g>
		</svg>
	);
};
