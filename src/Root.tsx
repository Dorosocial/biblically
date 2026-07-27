import React from 'react';
import {Composition} from 'remotion';
import {NeurolamBrainrot} from './NeurolamBrainrot/Composition';
import {DURATION, FPS, HEIGHT, WIDTH} from './NeurolamBrainrot/constants';
import {NeurolamBrainrotWide} from './NeurolamBrainrotWide/Composition';
import {
	DURATION as WIDE_DURATION,
	FPS as WIDE_FPS,
	HEIGHT as WIDE_HEIGHT,
	WIDTH as WIDE_WIDTH,
} from './NeurolamBrainrotWide/constants';

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
			<Composition
				id="NeurolamBrainrotWide"
				component={NeurolamBrainrotWide}
				durationInFrames={WIDE_DURATION}
				fps={WIDE_FPS}
				width={WIDE_WIDTH}
				height={WIDE_HEIGHT}
			/>
		</>
	);
};
