import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

// Short overlay label ("HEAVY", "100x MASS", ...) that pops in/out inside an
// [inFrame, outFrame] window with a quick scale+fade — matches the "new
// visual info every 1-2s" pacing without ever lingering as dead text.
export const Label: React.FC<{
	text: string;
	inFrame: number;
	outFrame: number;
	x: number; // percent, 0-100
	y: number; // percent, 0-100
	size?: number; // px
	color?: string;
	weight?: number;
	align?: 'left' | 'center' | 'right';
	tracking?: number;
}> = ({
	text,
	inFrame,
	outFrame,
	x,
	y,
	size = 48,
	color = '#ffffff',
	weight = 800,
	align = 'center',
	tracking = 0.02,
}) => {
	const frame = useCurrentFrame();
	if (frame < inFrame || frame > outFrame) return null;

	const popIn = interpolate(frame, [inFrame, inFrame + 8], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const popOut = interpolate(frame, [outFrame - 8, outFrame], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacity = Math.min(popIn, popOut);
	const scale = 0.88 + 0.12 * popIn;

	return (
		<div
			style={{
				position: 'absolute',
				left: `${x}%`,
				top: `${y}%`,
				transform: `translate(-50%, -50%) scale(${scale})`,
				opacity,
				fontFamily:
					"'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
				fontWeight: weight,
				fontSize: size,
				color,
				letterSpacing: tracking * size,
				textAlign: align,
				textShadow: '0 2px 24px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.8)',
				whiteSpace: 'nowrap',
				pointerEvents: 'none',
			}}
		>
			{text}
		</div>
	);
};

// Climbing numeric readout (e.g. a speed counter ticking up rapidly) — adds
// motion to HUD-style text so text beats don't read as static either.
export const Counter: React.FC<{
	inFrame: number;
	outFrame: number;
	from: number;
	to: number;
	x: number;
	y: number;
	prefix?: string;
	suffix?: string;
	size?: number;
}> = ({inFrame, outFrame, from, to, x, y, prefix = '', suffix = '', size = 40}) => {
	const frame = useCurrentFrame();
	if (frame < inFrame || frame > outFrame) return null;

	const opacity = Math.min(
		interpolate(frame, [inFrame, inFrame + 6], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}),
		interpolate(frame, [outFrame - 6, outFrame], [1, 0], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}),
	);
	const value = Math.round(
		interpolate(frame, [inFrame, outFrame - 4], [from, to], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}),
	);

	return (
		<div
			style={{
				position: 'absolute',
				left: `${x}%`,
				top: `${y}%`,
				transform: 'translate(-50%, -50%)',
				opacity,
				fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
				fontWeight: 800,
				fontVariantNumeric: 'tabular-nums',
				fontSize: size,
				color: '#ffe066',
				textShadow: '0 2px 20px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.85)',
				whiteSpace: 'nowrap',
				pointerEvents: 'none',
			}}
		>
			{prefix}
			{value}
			{suffix}
		</div>
	);
};

export const Caption: React.FC<{
	text: string;
	inFrame: number;
	outFrame: number;
}> = ({text, inFrame, outFrame}) => {
	const frame = useCurrentFrame();
	if (frame < inFrame || frame > outFrame) return null;
	const opacity = Math.min(
		interpolate(frame, [inFrame, inFrame + 5], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}),
		interpolate(frame, [outFrame - 5, outFrame], [1, 0], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}),
	);

	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				bottom: '9%',
				transform: 'translateX(-50%)',
				opacity,
				maxWidth: '86%',
				fontFamily:
					"'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
				fontWeight: 700,
				fontSize: 38,
				lineHeight: 1.25,
				color: '#ffffff',
				textAlign: 'center',
				textShadow: '0 2px 18px rgba(0,0,0,0.65), 0 1px 2px rgba(0,0,0,0.9)',
				pointerEvents: 'none',
			}}
		>
			{text}
		</div>
	);
};
