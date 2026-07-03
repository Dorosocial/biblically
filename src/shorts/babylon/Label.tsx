import {interpolate} from 'remotion';
import {COLORS} from './theme';
import type {CSSProperties} from 'react';

type LabelProps = {
	text: string;
	/** 0-1+ spring progress (may overshoot for a bounce). */
	progress: number;
	fontSize?: number;
	gold?: boolean;
	style?: CSSProperties;
};

// A text label that springs in (fade + scale) — used for map pin/distance
// labels. Dark ink by default; `gold` for emphasis labels like "85 KM".
export const Label: React.FC<LabelProps> = ({text, progress, fontSize = 22, gold = false, style}) => {
	const opacity = interpolate(progress, [0, 0.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const scale = interpolate(progress, [0, 1], [0.6, 1]);

	return (
		<div
			style={{
				position: 'absolute',
				opacity,
				transform: `scale(${scale})`,
				color: gold ? COLORS.goldDeep : COLORS.ink,
				fontFamily: 'sans-serif',
				fontWeight: 700,
				fontSize,
				letterSpacing: 1.5,
				textAlign: 'center',
				...style,
			}}
		>
			{text}
		</div>
	);
};
