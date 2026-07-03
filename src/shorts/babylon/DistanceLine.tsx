import {COLORS} from './theme';

type DistanceLineProps = {
	viewBox: string;
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	/** 0-1 draw-in reveal. */
	progress: number;
};

// A dashed "measurement" line between two points in the same aspect-
// corrected coordinate space as River paths (see riverPaths.ts) — distinct
// from the solid ink river lines, reads as a distance/survey marker.
export const DistanceLine: React.FC<DistanceLineProps> = ({viewBox, x1, y1, x2, y2, progress}) => {
	const reveal = Math.max(0, Math.min(1, progress));

	return (
		<svg viewBox={viewBox} preserveAspectRatio="none" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
			<line
				x1={x1}
				y1={y1}
				x2={x2}
				y2={y2}
				stroke={COLORS.goldDeep}
				strokeWidth={0.8}
				strokeLinecap="round"
				strokeDasharray="2.2 1.6"
				pathLength={100}
				strokeDashoffset={100 * (1 - reveal)}
			/>
		</svg>
	);
};
