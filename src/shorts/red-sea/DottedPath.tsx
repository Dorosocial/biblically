import {COLORS} from './theme';

type DottedPathProps = {
	d: string;
	viewBox: string;
	/** 0-1 draw-in reveal, from the path's start toward its end. */
	progress: number;
	/** Scene-local frame, used to keep the dots subtly marching even once fully revealed. */
	frame: number;
	/** Axis the path is predominantly revealed along. */
	direction?: 'vertical' | 'horizontal';
	opacity?: number;
	strokeWidth?: number;
};

const glowFilter = 'drop-shadow(0 0 5px rgba(184,196,204,0.95)) drop-shadow(0 0 2px rgba(5,36,40,0.9))';

const MARCH_SPEED = 0.35;
const DOT_PATTERN_LENGTH = 4.5;
const DOT_LENGTH = 1.6;

// A dotted "route" line — reveals progressively via a clip-path (rather
// than stroke-dashoffset, which would fight the dot pattern itself), and
// keeps a slow marching-dash crawl once fully drawn so it never reads as
// merely a static overlay.
export const DottedPath: React.FC<DottedPathProps> = ({
	d,
	viewBox,
	progress,
	frame,
	direction = 'vertical',
	opacity = 1,
	strokeWidth = 7,
}) => {
	const reveal = Math.max(0, Math.min(1, progress));
	const hiddenPct = (1 - reveal) * 100;
	const clip = direction === 'vertical' ? `inset(0 0 ${hiddenPct}% 0)` : `inset(0 ${hiddenPct}% 0 0)`;
	const march = -((frame * MARCH_SPEED) % DOT_PATTERN_LENGTH);

	return (
		<svg
			viewBox={viewBox}
			preserveAspectRatio="none"
			style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity, clipPath: clip}}
		>
			<path
				d={d}
				fill="none"
				stroke={COLORS.silver}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				pathLength={100}
				strokeDasharray={`${DOT_LENGTH} ${DOT_PATTERN_LENGTH - DOT_LENGTH}`}
				strokeDashoffset={march}
				style={{filter: glowFilter}}
			/>
		</svg>
	);
};
