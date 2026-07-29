import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// Critically damped (damping = 2*sqrt(mass*stiffness)) so the spring never
// overshoots past 1 — a smooth settle, no bounce.
const NO_BOUNCE_SPRING_CONFIG = {mass: 1, stiffness: 100, damping: 20};

interface Props {
	src: string;
	/** Total mounted length of this image's Sequence, in frames. */
	durationInFrames: number;
	entranceFrames?: number;
	exitFrames?: number;
}

// Scale 0.92 -> 1.0 combined with opacity 0 -> 1 on entry; the exact same
// spring curve mirrored at the tail end drives the reverse (scale back down
// toward 0.92, fade to 0) as the window closes.
export const NarratorImageOverlay: React.FC<Props> = ({
	src,
	durationInFrames,
	entranceFrames = 22,
	exitFrames = 17,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const enter = spring({frame, fps, config: NO_BOUNCE_SPRING_CONFIG, durationInFrames: entranceFrames});
	const exit = spring({
		frame: durationInFrames - frame,
		fps,
		config: NO_BOUNCE_SPRING_CONFIG,
		durationInFrames: exitFrames,
	});
	const visibility = Math.min(enter, exit);

	const scale = interpolate(visibility, [0, 1], [0.92, 1]);

	return (
		<Img
			src={staticFile(src)}
			style={{
				position: 'absolute',
				inset: 0,
				width: '100%',
				height: '100%',
				objectFit: 'contain',
				opacity: visibility,
				transform: `scale(${scale})`,
			}}
		/>
	);
};
