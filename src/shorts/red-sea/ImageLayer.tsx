import {Img} from 'remotion';

type ImageLayerProps = {
	src: string;
	/** Plain flex-child sizing (default) vs. absolute positioning inside a MapStack. */
	width: number | string;
	left?: string;
	top?: string;
	/** When positioned via left/top: 'top-left' (literal corner, default) or
	 * 'center' (the image centers on that point — e.g. a highlight). */
	anchor?: 'top-left' | 'center';
	opacity?: number;
	scale?: number;
	offsetX?: number;
	offsetY?: number;
	rotate?: number;
	/** 0-1+ highlight intensity: silver glow bloom around the cutout's stroke. */
	glow?: number;
	/** Reveal the image bottom-up (e.g. reeds "rising"), 0 = hidden, 1 = fully shown. */
	riseReveal?: number;
};

// A silver-stroke image cutout. When `left`/`top` are given it's absolutely
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
	rotate = 0,
	glow = 0,
	riseReveal,
}) => {
	const glowRadius = glow * 22;
	const glowAlpha = Math.min(Math.max(glow, 0), 1) * 0.85;
	const anchorTranslate = anchor === 'center' ? 'translate(-50%, -50%) ' : '';
	const clip = riseReveal === undefined ? undefined : `inset(${(1 - Math.max(0, Math.min(1, riseReveal))) * 100}% 0 0 0)`;

	return (
		<Img
			src={src}
			style={{
				position: left !== undefined || top !== undefined ? 'absolute' : 'static',
				left,
				top,
				width,
				opacity,
				transform: `${anchorTranslate}translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg) scale(${scale})`,
				clipPath: clip,
				filter: glow > 0 ? `drop-shadow(0 0 ${glowRadius}px rgba(184,196,204,${glowAlpha}))` : undefined,
			}}
		/>
	);
};
