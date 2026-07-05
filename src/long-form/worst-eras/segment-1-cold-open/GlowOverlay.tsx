import {pulse} from './motion';

type GlowOverlayProps = {
	left: string;
	top: string;
	/** Base diameter as % of the frame's width. */
	size: number;
	/** "r, g, b" triple, e.g. theme.ts's coldGlowRGB / warmGlowRGB. */
	colorRGB: string;
	/** 0-1+ fade-in level; this component keeps it alive with its own internal pulse. */
	intensity: number;
	frame: number;
	fps: number;
};

// A soft radial glow bloom, code-drawn (real transparency via a radial
// gradient fading to alpha 0) rather than a baked white-box PNG, so it
// composites cleanly over whatever scene sits beneath it.
export const GlowOverlay: React.FC<GlowOverlayProps> = ({left, top, size, colorRGB, intensity, frame, fps}) => {
	const clamped = Math.max(0, intensity);
	if (clamped <= 0.001) return null;

	const breathingSize = size * pulse(frame, fps, 0.1, 0.4);
	const alpha = Math.min(clamped, 1) * 0.55;

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
				background: `radial-gradient(circle, rgba(${colorRGB}, ${alpha}) 0%, rgba(${colorRGB}, 0) 70%)`,
			}}
		/>
	);
};
