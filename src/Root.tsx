import React from 'react';
import {Composition} from 'remotion';
import {NeurolamBrainrot} from './NeurolamBrainrot/Composition';
import {DURATION, FPS, HEIGHT, WIDTH} from './NeurolamBrainrot/constants';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="NeurolamBrainrot"
				component={NeurolamBrainrot}
				durationInFrames={DURATION}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>
		</>
	);
};
