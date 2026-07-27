import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {AUDIO, BG_COLOR, DURATION, SECTIONS} from './constants';
import {DistractorLayer} from './DistractorLayer';
import {ExclusionOccluder} from './ExclusionOccluder';
import {CenterDot} from './CenterDot';
import {IntroTitle} from './overlays/IntroTitle';
import {RoundTag} from './overlays/RoundTag';
import {OutroLine} from './overlays/OutroLine';
import {EndCard} from './overlays/EndCard';
import {FadeToBlack} from './overlays/FadeToBlack';

const VoiceOver: React.FC<{from: number; src: string}> = ({from, src}) => (
	<Sequence from={from} durationInFrames={DURATION - from} name={src}>
		<Audio src={staticFile(src)} />
	</Sequence>
);

export const NeurolamBrainrot: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: BG_COLOR}}>
			{/* Distractors + the disc that keeps them out of the exclusion zone. */}
			<DistractorLayer />
			<ExclusionOccluder />

			{/* Sparse text/UI, positioned well clear of the exclusion zone. */}
			<IntroTitle />
			<RoundTag label="ROUND 1 · WARM UP" startFrame={SECTIONS.round1.start} />
			<RoundTag label="ROUND 2 · ESCALATION" startFrame={SECTIONS.round2.start} />
			<RoundTag label="ROUND 3 · PEAK DIFFICULTY" startFrame={SECTIONS.round3.start} />
			<RoundTag label="ROUND 4 · THE CATCH" startFrame={SECTIONS.round4.start} />
			<OutroLine />
			<EndCard />

			{/* The dot: always topmost, always at dead center. */}
			<CenterDot />

			<FadeToBlack />

			<VoiceOver from={SECTIONS.intro.start} src={AUDIO.intro} />
			<VoiceOver from={SECTIONS.round1.start} src={AUDIO.round1} />
			<VoiceOver from={SECTIONS.round2.start} src={AUDIO.round2} />
			<VoiceOver from={SECTIONS.round3.start} src={AUDIO.round3} />
			<VoiceOver from={SECTIONS.round4.start} src={AUDIO.round4} />
			<VoiceOver from={SECTIONS.outro.start} src={AUDIO.outro} />
		</AbsoluteFill>
	);
};
