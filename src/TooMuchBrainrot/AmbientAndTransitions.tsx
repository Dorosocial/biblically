import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {AMBIENT_BED, TRANSITION_WHOOSH_EX10_CUT, TRANSITION_WHOOSH_EX11_REVEAL} from './assets';
import {EX10_CUT_FRAME, EX11_REVEAL_CUT_FRAME, TOTAL_DURATION_FRAMES} from './schedule';

// Constant, well below VO (which plays at 1) — supports, never competes.
const AMBIENT_BED_VOLUME = 0.08;

export const AmbientAndTransitions: React.FC = () => {
	return (
		<>
			<Sequence from={0} durationInFrames={TOTAL_DURATION_FRAMES}>
				<Audio src={staticFile(AMBIENT_BED)} volume={AMBIENT_BED_VOLUME} />
			</Sequence>

			{/* The only two whoosh moments in the whole video. */}
			<Sequence from={EX10_CUT_FRAME}>
				<Audio src={staticFile(TRANSITION_WHOOSH_EX10_CUT)} volume={1} />
			</Sequence>
			<Sequence from={EX11_REVEAL_CUT_FRAME}>
				<Audio src={staticFile(TRANSITION_WHOOSH_EX11_REVEAL)} volume={1} />
			</Sequence>
		</>
	);
};
