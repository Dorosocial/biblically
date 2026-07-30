import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// Critically damped (damping = 2*sqrt(mass*stiffness)) so the spring never
// overshoots — a smooth settle, no bounce.
const NO_BOUNCE_SPRING_CONFIG = {mass: 1, stiffness: 100, damping: 20};

const IMAGE_DIR = 'neurolam/too-much-brainrot/assets/images/narrator';

interface Props {
	file: string;
	/** Original (unextended) content duration, for correct entrance/exit timing regardless of any trailing background extension. */
	contentDuration: number;
	entranceFrames?: number;
	exitFrames?: number;
	children?: React.ReactNode;
}

// Full-frame scale-up + fade-in entrance (spring, no bounce), reverse on
// exit. The image itself is pose-only — any extra graphic elements are
// passed as children, layered on top.
export const SilhouetteImageBeat: React.FC<Props> = ({
	file,
	contentDuration,
	entranceFrames = 22,
	exitFrames = 17,
	children,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const enter = spring({frame, fps, config: NO_BOUNCE_SPRING_CONFIG, durationInFrames: entranceFrames});
	const exit = spring({
		frame: contentDuration - frame,
		fps,
		config: NO_BOUNCE_SPRING_CONFIG,
		durationInFrames: exitFrames,
	});
	const visibility = Math.min(enter, exit);
	const scale = interpolate(visibility, [0, 1], [0.92, 1]);

	return (
		<>
			<Img
				src={staticFile(`${IMAGE_DIR}/${file}`)}
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
			{children}
		</>
	);
};
