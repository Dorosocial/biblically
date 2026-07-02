import {EUPHRATES_PATH, GIHON_PATH, MAP_ASPECT, MAP_VIEWBOX, PISHON_PATH, TIGRIS_PATH} from './MiddleEastMap';
import {COLORS} from './theme';

type RiverOverlayProps = {
	width: number;
	opacity: number;
};

// The four river paths, already fully "identified" (cyan) by this point in
// the video, redrawn directly over the dry-valley photo (Scene 8+) rather
// than over the schematic navy-grid map.
export const RiverOverlay: React.FC<RiverOverlayProps> = ({width, opacity}) => {
	const height = width * MAP_ASPECT;

	return (
		<svg
			width={width}
			height={height}
			viewBox={MAP_VIEWBOX}
			style={{opacity, position: 'absolute', top: 0, left: 0}}
		>
			{[PISHON_PATH, GIHON_PATH, EUPHRATES_PATH, TIGRIS_PATH].map((d) => (
				<path key={d} d={d} fill="none" stroke={COLORS.strokeCyan} strokeWidth={4} strokeLinecap="round" />
			))}
		</svg>
	);
};
