import {interpolate} from 'remotion';
import {COLORS} from './theme';
import type {CSSProperties} from 'react';

type LabelProps = {
	text: string;
	/** 0-1+ spring progress (may overshoot for a bounce). */
	progress: number;
	fontSize?: number;
	dim?: boolean;
	style?: CSSProperties;
};

// A text label that springs in (fade + scale) — used for map/region names.
// Near-white by default; `dim` for secondary/handed-off labels.
export const Label: React.FC<LabelProps> = ({text, progress, fontSize = 30, dim = false, style}) => {
	const opacity = interpolate(progress, [0, 0.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const scale = interpolate(progress, [0, 1], [0.6, 1]);

	return (
		<div
			style={{
				position: 'absolute',
				opacity,
				transform: `scale(${scale})`,
				color: dim ? COLORS.textDim : COLORS.text,
				fontFamily: 'sans-serif',
				fontWeight: 700,
				fontSize,
				letterSpacing: 1.5,
				textAlign: 'center',
				textShadow: '0 2px 6px rgba(0,0,0,0.6)',
				...style,
			}}
		>
			{text}
		</div>
	);
};
