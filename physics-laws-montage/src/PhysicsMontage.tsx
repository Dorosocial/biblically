import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {ACTS} from './timing';
import {OpeningAct} from './shots/OpeningAct';
import {MomentumAct} from './shots/MomentumAct';
import {AngularMomentumAct} from './shots/AngularMomentumAct';
import {EnergyAct} from './shots/EnergyAct';
import {NewtonFirstLawAct} from './shots/NewtonFirstLawAct';

export const PhysicsMontage: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#0a0e16'}}>
			{/* Narration synced from frame 1 using real Whisper-transcribed timing. */}
			<Audio src={staticFile('narration.mp3')} />

			<Sequence from={ACTS.opening.from} durationInFrames={ACTS.opening.duration}>
				<OpeningAct />
			</Sequence>

			<Sequence from={ACTS.momentum.from} durationInFrames={ACTS.momentum.duration}>
				<MomentumAct />
			</Sequence>

			<Sequence
				from={ACTS.angularMomentum.from}
				durationInFrames={ACTS.angularMomentum.duration}
			>
				<AngularMomentumAct />
			</Sequence>

			<Sequence from={ACTS.energy.from} durationInFrames={ACTS.energy.duration}>
				<EnergyAct />
			</Sequence>

			<Sequence
				from={ACTS.newtonFirstLaw.from}
				durationInFrames={ACTS.newtonFirstLaw.duration}
			>
				<NewtonFirstLawAct />
			</Sequence>
		</AbsoluteFill>
	);
};
