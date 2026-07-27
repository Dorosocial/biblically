import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
	CENTER_X,
	CENTER_Y,
	COUNTDOWN_START_FRAME,
	COUNTDOWN_START_SECONDS,
	DOT_COLOR,
	DOT_RADIUS,
} from './constants';
import {DOT_FLASH} from './dotFlash';

const formatTime = (totalSeconds: number): string => {
	const m = Math.floor(totalSeconds / 60);
	const s = Math.floor(totalSeconds % 60);
	return `${m}:${s.toString().padStart(2, '0')}`;
};

// Position is fixed via left/top + translate(-50%,-50%) and never changes.
// Only opacity (intro fade), scale (intro settle + flash pulse), and color
// (single Round 4 flash) ever animate. The countdown text sits on top of
// everything, always fully opaque, so it stays legible through any
// distractor or background activity.
export const CenterDot: React.FC = () => {
	const frame = useCurrentFrame();

	const opacity = interpolate(frame, [0, 60], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const settleScale = interpolate(frame, [0, 40, 60], [0.4, 1.08, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const flashEnd = DOT_FLASH.startFrame + DOT_FLASH.duration;
	const isFlashing = frame >= DOT_FLASH.startFrame && frame < flashEnd;
	const color = isFlashing ? DOT_FLASH.color : DOT_COLOR;

	const running = frame >= COUNTDOWN_START_FRAME;
	const secondsElapsed = Math.floor((frame - COUNTDOWN_START_FRAME) / 30);
	const secondsRemaining = Math.max(0, COUNTDOWN_START_SECONDS - secondsElapsed);
	const label = running ? formatTime(secondsRemaining) : '--:--';

	return (
		<div
			style={{
				position: 'absolute',
				left: CENTER_X,
				top: CENTER_Y,
				width: DOT_RADIUS * 2,
				height: DOT_RADIUS * 2,
				borderRadius: '50%',
				background: color,
				transform: `translate(-50%, -50%) scale(${settleScale})`,
				opacity,
				boxShadow: `0 0 46px ${color}77`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<span
				style={{
					fontFamily: '"Helvetica Neue", Arial, sans-serif',
					fontWeight: 800,
					fontVariantNumeric: 'tabular-nums',
					fontSize: DOT_RADIUS * 0.6,
					letterSpacing: '-0.01em',
					color: '#FFFFFF',
					WebkitTextStroke: '3px rgba(6,10,16,0.85)',
					textShadow: '0 2px 12px rgba(0,0,0,0.5)',
					opacity: running ? 1 : 0.55,
				}}
			>
				{label}
			</span>
		</div>
	);
};
