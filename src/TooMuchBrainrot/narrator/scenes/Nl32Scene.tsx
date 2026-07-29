import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X} from '../../constants';
import {driftValue} from '../../drift';
import {FULL_ANCHOR_Y, FULL_SCALE} from '../layout';
import {NarratorFigure} from '../NarratorFigure';
import {PALE_GOLD} from '../palette';

// Local feet y (hip 228 + leg length 160) scaled into screen space, so the
// light trails originate exactly at the figure's feet.
const FEET_Y = FULL_ANCHOR_Y + 388 * FULL_SCALE;

// The core thesis image: a fork, two diverging light trails, one arm raised
// as if choosing. Full-frame scale — this is the longest-lingering narrator
// scene, so the entrance settles early and holds calmly.
export const Nl32Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({frame, fps, config: {mass: 1, stiffness: 80, damping: 20}, durationInFrames: 45});
	const trailLength = interpolate(entrance, [0, 1], [0, 1]);
	const scale = FULL_SCALE + driftValue(frame, 170, 0.025);

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<line
				x1={CENTER_X}
				y1={FEET_Y}
				x2={CENTER_X - 620 * trailLength}
				y2={FEET_Y - 480 * trailLength}
				stroke={PALE_GOLD}
				strokeWidth={5}
				opacity={0.5 * trailLength}
			/>
			<line
				x1={CENTER_X}
				y1={FEET_Y}
				x2={CENTER_X + 620 * trailLength}
				y2={FEET_Y - 220 * trailLength}
				stroke={PALE_GOLD}
				strokeWidth={5}
				opacity={0.3 * trailLength}
			/>
			<g transform={`translate(${CENTER_X}, ${FULL_ANCHOR_Y}) scale(${scale})`}>
				<NarratorFigure armPose="raisedFork" legPose="standing" />
			</g>
		</svg>
	);
};
