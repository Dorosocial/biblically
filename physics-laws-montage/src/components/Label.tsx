import React from 'react';
import {interpolate} from 'remotion';

/**
 * Short HTML/CSS overlay label — clean sans-serif, always a single short
 * phrase (never a paragraph), per the brief. Renders as a plain absolutely
 * positioned div over the ThreeCanvas (not inside the R3F tree) so text
 * stays crisp at any zoom/DPR.
 */
export const Label: React.FC<{
	readonly text: string;
	readonly localFrame: number;
	/** Frame (local) this label starts animating in. */
	readonly inAt: number;
	/** Frame (local) this label starts animating out. Omit to stay held. */
	readonly outAt?: number;
	readonly top: string; // CSS position, e.g. "12%"
	readonly left?: string;
	readonly right?: string;
	readonly color?: string;
	readonly fontSize?: number;
	readonly align?: 'left' | 'center' | 'right';
}> = ({
	text,
	localFrame,
	inAt,
	outAt,
	top,
	left,
	right,
	color = '#ffffff',
	fontSize = 44,
	align = 'center',
}) => {
	const scale = interpolate(localFrame, [inAt, inAt + 8], [0.7, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacityIn = interpolate(localFrame, [inAt, inAt + 6], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacityOut =
		outAt === undefined
			? 1
			: interpolate(localFrame, [outAt, outAt + 8], [1, 0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
	const opacity = Math.min(opacityIn, opacityOut);

	if (opacity <= 0) {
		return null;
	}

	return (
		<div
			style={{
				position: 'absolute',
				top,
				left,
				right,
				transform: `scale(${scale})`,
				opacity,
				textAlign: align,
				fontFamily: '"Helvetica Neue", Arial, sans-serif',
				fontWeight: 800,
				letterSpacing: 2,
				fontSize,
				color,
				textShadow: '0 2px 18px rgba(0,0,0,0.75), 0 0 30px rgba(0,0,0,0.5)',
				textTransform: 'uppercase',
				whiteSpace: 'nowrap',
			}}
		>
			{text}
		</div>
	);
};
