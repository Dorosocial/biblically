type VignetteProps = {
	/** 0-1 darkening level at the edges. */
	intensity: number;
};

// Code-drawn radial darkening from the edges inward — real transparency at
// the center so the scene beneath stays clear while the frame closes in.
export const Vignette: React.FC<VignetteProps> = ({intensity}) => {
	const clamped = Math.min(Math.max(intensity, 0), 1);
	if (clamped <= 0.001) return null;

	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				background: `radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 38%, rgba(0, 0, 0, ${0.8 * clamped}) 100%)`,
			}}
		/>
	);
};
