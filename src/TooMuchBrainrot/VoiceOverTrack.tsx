import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {VO_CLIPS} from './schedule';

const FADE_IN_FRAMES = 3;

// Flat volume for the full clip. The only exception is a 3-frame linear
// ramp from 0 -> 1 at the very start, purely to avoid a click/pop where the
// waveform is cut on to a nonzero sample. `extrapolateRight: 'clamp'` is the
// part that matters: without it this ramp keeps climbing for the entire
// `outputRange` span instead of holding at 1, which is what produced the
// "gets louder as it plays" bug.
export const voClipVolume = (frame: number): number => {
	if (frame >= FADE_IN_FRAMES) {
		return 1;
	}

	return frame / FADE_IN_FRAMES;
};

export const VoiceOverTrack: React.FC = () => {
	return (
		<>
			{VO_CLIPS.map((clip) => (
				<Sequence key={clip.name} from={clip.from} durationInFrames={clip.durationInFrames}>
					<Audio
						src={staticFile(`neurolam/too-much-brainrot/audio/voiceover/${clip.file}`)}
						volume={voClipVolume}
					/>
				</Sequence>
			))}
		</>
	);
};
