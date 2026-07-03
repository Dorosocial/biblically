import {COLORS} from './theme';

type StrikeThroughProps = {
	/** 0-1 draw-in reveal. */
	progress: number;
	width?: number;
	height?: number;
};

// A hand-drawn-feeling diagonal strike, drawn on via stroke-dashoffset — used
// to cross out/negate a term or image as the VO debunks it. Silver to match
// the fingerprint's stroke color, with a dark drop-shadow so it reads over
// both light text and dark image fills.
export const StrikeThrough: React.FC<StrikeThroughProps> = ({progress, width = 420, height = 90}) => {
	const reveal = Math.max(0, Math.min(1, progress));

	return (
		<svg
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				pointerEvents: 'none',
				filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
			}}
		>
			<path
				d={`M12,${height - 14} C${width * 0.35},${height * 0.55} ${width * 0.65},${height * 0.45} ${width - 12},14`}
				stroke={COLORS.silver}
				strokeWidth={9}
				strokeLinecap="round"
				fill="none"
				pathLength={100}
				strokeDasharray={100}
				strokeDashoffset={100 * (1 - reveal)}
			/>
		</svg>
	);
};
