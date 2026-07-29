import React from 'react';
import {interpolate} from 'remotion';

interface Props {
	/** Absolute (global) current frame — this wraps the whole composition, so it can't rely on a local Sequence frame. */
	frame: number;
	windowStart: number;
	windowDurationInFrames: number;
	children: React.ReactNode;
}

// The one reserved screen-shake moment in the whole video (ex10). Always
// mounted around the entire frame, but the envelope is zero outside
// [windowStart, windowStart + windowDurationInFrames), so it's an identity
// transform everywhere else.
export const ScreenShake: React.FC<Props> = ({frame, windowStart, windowDurationInFrames, children}) => {
	const localFrame = frame - windowStart;

	const envelope = interpolate(
		localFrame,
		[0, windowDurationInFrames * 0.4, windowDurationInFrames],
		[0, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	const magnitude = 14 * envelope;
	const dx = Math.sin(frame * 2.4) * magnitude;
	const dy = Math.cos(frame * 3.1) * magnitude;

	return <div style={{position: 'absolute', inset: 0, transform: `translate(${dx}px, ${dy}px)`}}>{children}</div>;
};
