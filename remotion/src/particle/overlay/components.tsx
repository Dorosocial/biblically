import React from 'react';
import {useCurrentFrame} from 'remotion';
import {climbIn, glowPulse, slideIn} from '../../lib/animations';
import {theme, fontStack} from '../theme';

const glowText = (color: string, strength: number) =>
	`0 0 ${14 * strength}px ${color}, 0 0 ${34 * strength}px ${color}, 0 0 ${70 * strength}px ${color}66`;

/** A short, punchy animated label — drifts/fades into place, never a static pop-in. */
export const Label: React.FC<{
	text: string;
	startFrame: number;
	x?: number | string; // left position
	y?: number | string; // top position
	size?: number;
	color?: string;
	from?: 'below' | 'left' | 'right';
}> = ({text, startFrame, x = '50%', y = '50%', size = 54, color = theme.textPrimary, from = 'below'}) => {
	const frame = useCurrentFrame();
	const below = climbIn(frame, startFrame, 16);
	const side = slideIn(frame, startFrame, from === 'left' ? -70 : 70, 16);
	const g = glowPulse(frame, size, 1.7);

	const opacity = from === 'below' ? below.opacity : side.opacity;
	const transform =
		from === 'below'
			? `translate(-50%, -50%) translateY(${below.translateY}px) scale(${below.scale})`
			: `translate(-50%, -50%) translateX(${side.translateX}px)`;

	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				opacity,
				transform,
				fontFamily: fontStack,
				fontWeight: 800,
				fontSize: size,
				letterSpacing: 3,
				color,
				textShadow: glowText(color, g),
				textAlign: 'center',
				whiteSpace: 'nowrap',
			}}
		>
			{text}
		</div>
	);
};

/** Faint background text, used for the "IMPOSSIBLE?" punctuated-pause beat. */
export const GhostText: React.FC<{text: string; startFrame: number}> = ({text, startFrame}) => {
	const frame = useCurrentFrame();
	const {opacity, scale} = climbIn(frame, startFrame, 22);
	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: '50%',
				transform: `translate(-50%, -50%) scale(${scale})`,
				opacity: opacity * 0.4,
				fontFamily: fontStack,
				fontWeight: 800,
				fontSize: 96,
				letterSpacing: 4,
				color: theme.textDim,
				textAlign: 'center',
				whiteSpace: 'nowrap',
			}}
		>
			{text}
		</div>
	);
};

/** Large dramatic word, e.g. "NO" — quick zoom-in punch. */
export const BigWord: React.FC<{text: string; startFrame: number; color?: string}> = ({text, startFrame, color = theme.ghostBall}) => {
	const frame = useCurrentFrame();
	const local = frame - startFrame;
	const {opacity, scale} = climbIn(frame, startFrame, 10);
	const punch = Math.max(scale, 1 + Math.max(0, 8 - local) * 0.05);
	const g = glowPulse(frame, 3, 2.5);
	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: '46%',
				transform: `translate(-50%, -50%) scale(${punch})`,
				opacity,
				fontFamily: fontStack,
				fontWeight: 900,
				fontSize: 150,
				color,
				textShadow: glowText(color, g),
			}}
		>
			{text}
		</div>
	);
};
