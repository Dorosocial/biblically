import {Img} from 'remotion';

type MapImageLayerProps = {
	src: string;
	/** Position/size as CSS percentages of the parent container. */
	left: string;
	top: string;
	width: string;
	/** 0-1 fade. */
	opacity?: number;
	/** Scale applied on top of the layer's own position (pop/bounce). */
	scale?: number;
	/** 0-1+ highlight intensity: brightens the black fill and adds a soft white glow. */
	glow?: number;
	/** Extra Y offset in px, e.g. for a drop-in entrance. */
	offsetY?: number;
	/** Mirror vertically, e.g. mountain-range framing the top edge. */
	flipY?: boolean;
	/**
	 * 'screen' (default) makes each cutout's black fill vanish against the
	 * dark background, leaving only its white stroke visible — otherwise
	 * many overlapping black-fill silhouettes (rivers/highlights/map-base)
	 * compound into an unreadable solid blob. Photographic cutouts
	 * (dry-valley, water-texture) should pass 'normal' to keep their color.
	 */
	blend?: 'screen' | 'normal';
};

// Each processed map/geography PNG (map-base, the four rivers, region
// highlights, pin, mountains, depth arrow) is its own independently
// cropped cutout — not pre-registered to a shared map coordinate system —
// so every layer gets its own explicit position/size within the content
// container to build a coherent composed map.
export const MapImageLayer: React.FC<MapImageLayerProps> = ({
	src,
	left,
	top,
	width,
	opacity = 1,
	scale = 1,
	glow = 0,
	offsetY = 0,
	flipY = false,
	blend = 'screen',
}) => {
	const brightness = 1 + glow * 0.7;
	const glowRadius = glow * 20;
	const glowAlpha = Math.min(Math.max(glow, 0), 1) * 0.9;

	return (
		<Img
			src={src}
			style={{
				position: 'absolute',
				left,
				top,
				width,
				opacity,
				transform: `translateY(${offsetY}px) scale(${scale}) ${flipY ? 'scaleY(-1)' : ''}`,
				mixBlendMode: blend === 'screen' ? 'screen' : undefined,
				filter:
					glow > 0
						? `brightness(${brightness}) drop-shadow(0 0 ${glowRadius}px rgba(255,255,255,${glowAlpha}))`
						: undefined,
			}}
		/>
	);
};
