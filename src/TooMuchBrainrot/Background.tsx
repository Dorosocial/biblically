import React from 'react';
import {useCurrentFrame} from 'remotion';
import {BG_COLOR, FPS, HEIGHT, WIDTH} from './constants';
import {driftValue} from './drift';

// A very slow-panning vignette so the frame has a second, independent source
// of continuous motion besides the dot.
export const Background: React.FC = () => {
	const frame = useCurrentFrame();

	const px = 50 + driftValue(frame, FPS * 17, 14, 0.4);
	const py = 50 + driftValue(frame, FPS * 21, 10, 1.1);

	return (
		<div
			style={{
				position: 'absolute',
				width: WIDTH,
				height: HEIGHT,
				backgroundColor: BG_COLOR,
				backgroundImage: `radial-gradient(circle at ${px}% ${py}%, #141b26 0%, ${BG_COLOR} 70%)`,
			}}
		/>
	);
};
