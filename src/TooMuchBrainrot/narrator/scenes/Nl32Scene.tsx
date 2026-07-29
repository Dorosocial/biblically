import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {driftValue} from '../../drift';
import {NarratorFigure} from '../NarratorFigure';
import {PALE_GOLD} from '../palette';

// The core thesis image: a fork, two diverging light trails, one arm raised
// as if choosing. Full-frame scale — this is the longest-lingering narrator
// scene, so the entrance settles early and holds calmly.
export const Nl32Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({frame, fps, config: {mass: 1, stiffness: 80, damping: 20}, durationInFrames: 45});
	const trailLength = interpolate(entrance, [0, 1], [0, 1]);
	const scale = 3.3 + driftValue(frame, 170, 0.03);

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<line
				x1={CENTER_X}
				y1={CENTER_Y + 420}
				x2={CENTER_X - 520 * trailLength}
				y2={CENTER_Y - 260 * trailLength}
				stroke={PALE_GOLD}
				strokeWidth={4}
				opacity={0.5 * trailLength}
			/>
			<line
				x1={CENTER_X}
				y1={CENTER_Y + 420}
				x2={CENTER_X + 520 * trailLength}
				y2={CENTER_Y - 40 * trailLength}
				stroke={PALE_GOLD}
				strokeWidth={4}
				opacity={0.3 * trailLength}
			/>
			<g transform={`translate(${CENTER_X}, ${CENTER_Y + 150}) scale(${scale})`}>
				<NarratorFigure armPose="raisedFork" legPose="standing" />
			</g>
		</svg>
	);
};
