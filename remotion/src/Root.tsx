import React from 'react';
import {Composition} from 'remotion';
import {SecondVsBillionYears, WIDTH, HEIGHT} from './Composition';
import {DURATION_IN_FRAMES, FPS} from './lib/timing';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="SecondVsBillionYears"
				component={SecondVsBillionYears}
				durationInFrames={DURATION_IN_FRAMES}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>
		</>
	);
};
