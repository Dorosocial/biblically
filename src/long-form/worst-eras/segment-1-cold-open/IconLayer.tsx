import {Img} from 'remotion';

type IconLayerProps = {
	src: string;
	/** Rendered width in px at the 1920-wide frame; height follows the source's own aspect ratio. */
	width: number;
	left: string;
	top: string;
	opacity?: number;
	scale?: number;
};

// A single isolated cutout (e.g. the jar, the small widow figure) generated
// on its own plain-white canvas with generous padding — positioned and sized
// as a standalone element rather than cropped full-bleed, so beats can
// stage deliberate scale contrast (e.g. the "SCALE DISTORTION" jar/widow
// composite) within one frame.
export const IconLayer: React.FC<IconLayerProps> = ({src, width, left, top, opacity = 1, scale = 1}) => (
	<Img
		src={src}
		style={{
			position: 'absolute',
			left,
			top,
			width,
			transform: `translate(-50%, -50%) scale(${scale})`,
			opacity,
		}}
	/>
);
