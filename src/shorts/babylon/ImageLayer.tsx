import {Img} from 'remotion';

type ImageLayerProps = {
	src: string;
	/** Plain flex-child sizing (default) vs. absolute positioning inside a MapStack. */
	width: number | string;
	left?: string;
	top?: string;
	/** When positioned via left/top: 'top-left' (literal corner, default) or
	 * 'center' (the image centers on that point — e.g. a marker). */
	anchor?: 'top-left' | 'center';
	opacity?: number;
	scale?: number;
	offsetX?: number;
	offsetY?: number;
	/** 0-1+ highlight intensity: gold glow bloom around the cutout's stroke. */
	glow?: number;
};

// A gold-stroke image cutout. When `left`/`top` are given it's absolutely
// positioned inside a MapStack; otherwise it's a plain sized flex child of
// Stage, centering naturally as part of the scene's group.
export const ImageLayer: React.FC<ImageLayerProps> = ({
	src,
	width,
	left,
	top,
	anchor = 'top-left',
	opacity = 1,
	scale = 1,
	offsetX = 0,
	offsetY = 0,
	glow = 0,
}) => {
	const glowRadius = glow * 22;
	const glowAlpha = Math.min(Math.max(glow, 0), 1) * 0.85;
	const anchorTranslate = anchor === 'center' ? 'translate(-50%, -50%) ' : '';

	return (
		<Img
			src={src}
			style={{
				position: left !== undefined || top !== undefined ? 'absolute' : 'static',
				left,
				top,
				width,
				opacity,
				transform: `${anchorTranslate}translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
				filter: glow > 0 ? `drop-shadow(0 0 ${glowRadius}px rgba(212,175,55,${glowAlpha}))` : undefined,
			}}
		/>
	);
};
