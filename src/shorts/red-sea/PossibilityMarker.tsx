import {interpolate} from 'remotion';
import {COLORS} from './theme';

type PossibilityMarkerProps = {
	label: string;
	/** 0-1+ spring-in progress (may overshoot for a bounce). */
	progress: number;
	/** 0-1 highlight amount — brightens fill/glow and lifts opacity toward 1; 0 dims toward a faint outline. */
	glow?: number;
	size?: number;
};

// A code-drawn circular marker (no dedicated asset for this) used for the
// "two possibilities" beat — a numbered badge with a silver ring and glow
// that can be individually brightened or dimmed per possibility.
export const PossibilityMarker: React.FC<PossibilityMarkerProps> = ({label, progress, glow = 0.5, size = 220}) => {
	const scale = Math.max(progress, 0);
	const opacity = interpolate(Math.min(progress, 1), [0, 0.15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const g = Math.max(0, Math.min(1, glow));
	const ringAlpha = 0.4 + g * 0.6;
	const glowRadius = 8 + g * 26;
	const fillAlpha = 0.12 + g * 0.28;

	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: '50%',
				transform: `scale(${scale})`,
				opacity,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: `rgba(184,196,204,${fillAlpha})`,
				border: `3px solid rgba(184,196,204,${ringAlpha})`,
				boxShadow: `0 0 ${glowRadius}px rgba(184,196,204,${g * 0.75})`,
			}}
		>
			<span
				style={{
					color: COLORS.text,
					fontFamily: 'sans-serif',
					fontWeight: 800,
					fontSize: size * 0.42,
					textShadow: '0 2px 6px rgba(0,0,0,0.5)',
				}}
			>
				{label}
			</span>
		</div>
	);
};
