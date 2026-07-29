import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {driftValue} from '../../drift';
import {NarratorFigure} from '../NarratorFigure';
import {PALE_GOLD} from '../palette';

interface Props {
	durationInFrames: number;
}

// Seated, gazing at a dark phone; a faint light just beginning to form —
// anticipation, not resolution. Full-frame scale.
export const Nl23Scene: React.FC<Props> = ({durationInFrames}) => {
	const frame = useCurrentFrame();

	const scale = 3.4 + driftValue(frame, 150, 0.04);
	// The light never fully forms — it only ever reaches a faint edge glow.
	const lightForm = interpolate(frame, [durationInFrames * 0.3, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<g transform={`translate(${CENTER_X}, ${CENTER_Y + 130}) scale(${scale})`}>
				<NarratorFigure armPose="restingOnKnee" legPose="seated" headTurn={-6} />
				<rect x={54} y={70} width={30} height={52} rx={5} fill="none" stroke={PALE_GOLD} strokeWidth={2} opacity={0.5} />
				<circle cx={82} cy={96} r={3 + lightForm * 4} fill={PALE_GOLD} opacity={lightForm * 0.55} />
			</g>
		</svg>
	);
};
