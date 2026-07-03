import {pulse} from './motion';

type HighlightGlowProps = {
	left: string;
	top: string;
	/** Base diameter as % of the parent MapStack's width. */
	size: number;
	/** 0-1+ reveal/intensity — springs in, then this component keeps it alive with its own internal pulse. */
	intensity: number;
	frame: number;
	fps: number;
};

// A soft steel-blue bloom + pulsing ring, used to call out a region on a
// map image that has no dedicated highlight cutout of its own. Placed
// absolutely inside a MapStack, anchored on its own center. Uses silverDeep
// rather than the pale `silver` — a light bloom would all but disappear
// against the white page.
export const HighlightGlow: React.FC<HighlightGlowProps> = ({left, top, size, intensity, frame, fps}) => {
	const clamped = Math.max(0, intensity);
	const breathingSize = size * pulse(frame, fps, 0.06, 0.35);

	if (clamped <= 0.001) return null;

	return (
		<div
			style={{
				position: 'absolute',
				left,
				top,
				width: `${breathingSize}%`,
				height: `${breathingSize}%`,
				borderRadius: '50%',
				transform: 'translate(-50%, -50%)',
				opacity: Math.min(clamped, 1),
				background: 'radial-gradient(circle, rgba(110,136,148,0.32) 0%, rgba(110,136,148,0) 72%)',
				border: `2px solid rgba(110,136,148,${0.6 * Math.min(clamped, 1)})`,
			}}
		/>
	);
};
