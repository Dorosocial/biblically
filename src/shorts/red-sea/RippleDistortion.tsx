type RippleDistortionProps = {
	/** Unique per usage — becomes the SVG filter id. */
	id: string;
	frame: number;
	/** 0-1+ distortion strength; 0 renders the children undistorted. */
	strength: number;
	children: React.ReactNode;
};

// Wraps children in an animated SVG displacement filter (feTurbulence ->
// feDisplacementMap) to sell a "geography shifting" ripple, without any
// SMIL/CSS keyframe animation — the noise seed is simply re-derived from
// the current frame each render, which Remotion already re-renders per
// frame, so the ripple animates for free.
export const RippleDistortion: React.FC<RippleDistortionProps> = ({id, frame, strength, children}) => {
	const scale = Math.max(0, strength) * 16;
	const seed = frame * 0.4;

	return (
		<div style={{position: 'relative', width: '100%', height: '100%'}}>
			<svg width={0} height={0} style={{position: 'absolute'}}>
				<defs>
					<filter id={id} x="-20%" y="-20%" width="140%" height="140%">
						<feTurbulence type="fractalNoise" baseFrequency={0.015} numOctaves={2} seed={seed} result="noise" />
						<feDisplacementMap in="SourceGraphic" in2="noise" scale={scale} xChannelSelector="R" yChannelSelector="G" />
					</filter>
				</defs>
			</svg>
			<div style={{width: '100%', height: '100%', filter: scale > 0.05 ? `url(#${id})` : undefined}}>{children}</div>
		</div>
	);
};
