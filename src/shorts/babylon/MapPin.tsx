import {interpolate} from 'remotion';
import {COLORS} from './theme';

type MapPinProps = {
	left: string;
	top: string;
	/** 0-1+ spring progress (may overshoot for a pop-in bounce). */
	progress: number;
};

// A code-drawn map pin (no dedicated pin asset in this video's cutouts) —
// gold teardrop with an ink outline and center dot, tip anchored exactly
// at (left, top).
export const MapPin: React.FC<MapPinProps> = ({left, top, progress}) => {
	const scale = Math.max(progress, 0);
	const opacity = interpolate(Math.min(progress, 1), [0, 0.1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<svg
			width={26}
			height={34}
			viewBox="0 0 26 34"
			style={{
				position: 'absolute',
				left,
				top,
				transform: `translate(-50%, -100%) scale(${scale})`,
				transformOrigin: '50% 100%',
				opacity,
				overflow: 'visible',
			}}
		>
			<path
				d="M13,34 C13,34 2,20 2,13 C2,6 7,1 13,1 C19,1 24,6 24,13 C24,20 13,34 13,34 Z"
				fill={COLORS.gold}
				stroke={COLORS.ink}
				strokeWidth={2}
			/>
			<circle cx={13} cy={13} r={5} fill={COLORS.ink} />
		</svg>
	);
};
