import {Img} from 'remotion';

type SceneImageProps = {
	src: string;
	opacity?: number;
	scale?: number;
	offsetX?: number;
	offsetY?: number;
	/** CSS brightness() multiplier — 1 = normal, <1 dims toward black. */
	brightness?: number;
};

// A full-bleed base scene: one of the wide illustrations already composed on
// plain white, matching the persistent background exactly. Cropped to cover
// the 16:9 frame, then transformed for push-in/drift.
export const SceneImage: React.FC<SceneImageProps> = ({src, opacity = 1, scale = 1, offsetX = 0, offsetY = 0, brightness = 1}) => (
	<Img
		src={src}
		style={{
			position: 'absolute',
			inset: 0,
			width: '100%',
			height: '100%',
			objectFit: 'cover',
			opacity,
			transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
			filter: brightness !== 1 ? `brightness(${brightness})` : undefined,
		}}
	/>
);
