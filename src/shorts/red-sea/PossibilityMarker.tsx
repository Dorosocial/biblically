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
// "two possibilities" beat — a numbered badge with a silver ring, filled
// and shadowed more heavily as it's brightened/dimmed. On the white page a
// light "glow" would vanish, so emphasis reads instead as a darker
// fill/ring plus a soft ink drop-shadow (a lifted, more solid badge).
export const PossibilityMarker: React.FC<PossibilityMarkerProps> = ({label, progress, glow = 0.5, size = 220}) => {
	const scale = Math.max(progress, 0);
	const opacity = interpolate(Math.min(progress, 1), [0, 0.15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const g = Math.max(0, Math.min(1, glow));
	const ringAlpha = 0.5 + g * 0.5;
	const shadowRadius = 6 + g * 22;
	const fillAlpha = 0.1 + g * 0.32;

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
				background: `rgba(110,136,148,${fillAlpha})`,
				border: `3px solid rgba(110,136,148,${ringAlpha})`,
				boxShadow: `0 ${4 + g * 6}px ${shadowRadius}px rgba(18,43,50,${g * 0.4})`,
			}}
		>
			<span
				style={{
					color: COLORS.ink,
					fontFamily: 'sans-serif',
					fontWeight: 800,
					fontSize: size * 0.42,
				}}
			>
				{label}
			</span>
		</div>
	);
};
