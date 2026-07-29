import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y, DOT_COLOR} from '../../constants';
import {driftValue} from '../../drift';

const NO_BOUNCE = {mass: 1, stiffness: 90, damping: 20};

// The dot's first full-frame appearance — large, deliberate, calm. Not the
// tiny ambient PrimaryDot used during exercise holds.
export const Nl6Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({frame, fps, config: NO_BOUNCE, durationInFrames: 40});
	const radius = interpolate(entrance, [0, 1], [40, 190]);
	const breathe = driftValue(frame, fps * 2.6, 6);

	return (
		<div
			style={{
				position: 'absolute',
				left: CENTER_X - radius - breathe,
				top: CENTER_Y - radius - breathe,
				width: (radius + breathe) * 2,
				height: (radius + breathe) * 2,
				borderRadius: '50%',
				backgroundColor: DOT_COLOR,
				opacity: entrance,
				boxShadow: `0 0 ${radius * 0.6}px ${DOT_COLOR}`,
			}}
		/>
	);
};
