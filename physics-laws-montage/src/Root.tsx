import React from 'react';
import {Composition} from 'remotion';
import {PhysicsMontage} from './PhysicsMontage';
import {FPS, WIDTH, HEIGHT, DURATION_IN_FRAMES} from './timing';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="PhysicsMontage"
				component={PhysicsMontage}
				durationInFrames={DURATION_IN_FRAMES}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>
		</>
	);
};
