import {COLORS} from './theme';

type Peak = {x: number; height: number; width: number};

const TOP_PEAKS: Peak[] = [
	{x: 60, height: 70, width: 140},
	{x: 220, height: 100, width: 160},
	{x: 380, height: 60, width: 130},
	{x: 520, height: 90, width: 150},
	{x: 680, height: 65, width: 140},
];

const BOTTOM_PEAKS: Peak[] = [
	{x: 40, height: 80, width: 150},
	{x: 200, height: 55, width: 130},
	{x: 360, height: 95, width: 160},
	{x: 520, height: 70, width: 140},
	{x: 660, height: 85, width: 150},
];

export const MOUNTAIN_VIEWBOX_WIDTH = 800;
export const MOUNTAIN_ROW_HEIGHT = 140;
export const MOUNTAIN_PEAK_COUNT = TOP_PEAKS.length;

type MountainRangeProps = {
	edge: 'top' | 'bottom';
	/** One 0-1 reveal progress value per peak, staggered by the caller. */
	progress: number[];
};

// A row of simple triangular mountain silhouettes, drawn as line art —
// "framing" the valley scene's top and bottom edges. Height grows from the
// row's base line outward as each peak's progress goes 0-1.
export const MountainRange: React.FC<MountainRangeProps> = ({edge, progress}) => {
	const peaks = edge === 'top' ? TOP_PEAKS : BOTTOM_PEAKS;
	const baseY = edge === 'top' ? 0 : MOUNTAIN_ROW_HEIGHT;
	const sign = edge === 'top' ? 1 : -1;

	return (
		<svg
			width="100%"
			height={MOUNTAIN_ROW_HEIGHT}
			viewBox={`0 0 ${MOUNTAIN_VIEWBOX_WIDTH} ${MOUNTAIN_ROW_HEIGHT}`}
			preserveAspectRatio="none"
			style={{display: 'block'}}
		>
			{peaks.map((peak, i) => {
				const p = Math.max(progress[i] ?? 0, 0);
				const h = peak.height * Math.min(p, 1.2);
				const tipY = baseY + sign * h;
				const d = `M${peak.x - peak.width / 2},${baseY} L${peak.x},${tipY} L${peak.x + peak.width / 2},${baseY} Z`;
				return (
					<path
						key={peak.x}
						d={d}
						fill="none"
						stroke={COLORS.mapLine}
						strokeWidth={3}
						strokeLinejoin="round"
						opacity={Math.min(p * 2, 1)}
					/>
				);
			})}
		</svg>
	);
};
