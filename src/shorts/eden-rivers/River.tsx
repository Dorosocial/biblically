import type {CSSProperties} from 'react';

type RiverProps = {
	/** SVG path `d`, in the coordinate space of `viewBox`. */
	d: string;
	viewBox: string;
	/** 0-1 draw-in reveal, animated via stroke-dashoffset (a genuine path-draw, not a fade). */
	progress: number;
	/** Scene-local frame, used to drive the continuous marching-dash "flow" once mostly drawn. */
	frame: number;
	strokeWidth?: number;
	opacity?: number;
	/** 0-1+ glow intensity, e.g. once a river is "identified". */
	glow?: number;
	style?: CSSProperties;
};

const STROKE = '#FFFFFF';
const FLOW_DASH = '3 7';
const FLOW_PATTERN_LENGTH = 10;
const FLOW_SPEED = 0.55; // pathLength units/frame, in the normalized 0-100 pathLength space

// A river rendered as a code-drawn SVG path instead of a raster image. The
// path is normalized to pathLength=100 so stroke-dashoffset reveals it
// frame-accurately regardless of the curve's actual geometry (no ref
// measurement needed). Once mostly drawn, a second dashed pass continuously
// marches along the same path so the river never reads as merely faded in.
export const River: React.FC<RiverProps> = ({d, viewBox, progress, frame, strokeWidth = 5, opacity = 1, glow = 0, style}) => {
	const reveal = Math.max(0, Math.min(1, progress));
	const flowFadeIn = Math.max(0, Math.min(1, (reveal - 0.85) / 0.15));
	const flowOffset = -((frame * FLOW_SPEED) % FLOW_PATTERN_LENGTH);
	const glowRadius = glow * 14;

	return (
		<svg
			viewBox={viewBox}
			preserveAspectRatio="none"
			style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity, ...style}}
		>
			<path
				d={d}
				fill="none"
				stroke={STROKE}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
				pathLength={100}
				strokeDasharray={100}
				strokeDashoffset={100 * (1 - reveal)}
				style={glow > 0 ? {filter: `drop-shadow(0 0 ${glowRadius}px rgba(255,255,255,${Math.min(glow, 1) * 0.9}))`} : undefined}
			/>
			{flowFadeIn > 0 && (
				<path
					d={d}
					fill="none"
					stroke={STROKE}
					strokeWidth={strokeWidth * 0.55}
					strokeLinecap="round"
					opacity={0.85 * flowFadeIn}
					pathLength={100}
					strokeDasharray={FLOW_DASH}
					strokeDashoffset={flowOffset}
				/>
			)}
		</svg>
	);
};
