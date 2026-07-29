import React from 'react';
import {Composition} from 'remotion';
import {TooMuchBrainrot} from './TooMuchBrainrot/Composition';
import {FPS, HEIGHT, WIDTH} from './TooMuchBrainrot/constants';
import {TOTAL_DURATION_FRAMES} from './TooMuchBrainrot/schedule';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="TooMuchBrainrot"
				component={TooMuchBrainrot}
				durationInFrames={TOTAL_DURATION_FRAMES}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>
		</>
	);
};
