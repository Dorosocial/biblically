import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {secToFrames} from '../timing';
import {theme} from '../theme';

const SHOT_START = secToFrames(69.55);
const SHOT_END = secToFrames(71.22);

/**
 * A simple wireframe reference cube standing in for "something human-scale"
 * at the start of the continuous dive-to-the-atom shot. It's left behind
 * (faded out) early in the dive so the rest of the push is uncluttered.
 */
export const HumanScaleRef: React.FC = () => {
	const frame = useCurrentFrame();
	if (frame < SHOT_START - 10 || frame > SHOT_END) return null;
	const opacity = interpolate(frame, [SHOT_START - 10, SHOT_START + 6, SHOT_START + 30], [0, 0.8, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	if (opacity <= 0.001) return null;

	return (
		<mesh position={[0, 0, 3]}>
			<boxGeometry args={[3.2, 3.2, 3.2]} />
			<meshBasicMaterial color={theme.textDim} wireframe transparent opacity={opacity} />
		</mesh>
	);
};
