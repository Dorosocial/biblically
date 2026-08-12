import React from 'react';
import {Composition} from 'remotion';
import {SecondVsBillionYears, WIDTH, HEIGHT} from './Composition';
import {DURATION_IN_FRAMES, FPS} from './lib/timing';
import {ParticleSuperposition} from './particle/Composition';
import {DURATION_IN_FRAMES as PARTICLE_DURATION_IN_FRAMES, FPS as PARTICLE_FPS} from './particle/timing';

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
			<Composition
				id="ParticleSuperposition"
				component={ParticleSuperposition}
				durationInFrames={PARTICLE_DURATION_IN_FRAMES}
				fps={PARTICLE_FPS}
				width={WIDTH}
				height={HEIGHT}
			/>
		</>
	);
};
