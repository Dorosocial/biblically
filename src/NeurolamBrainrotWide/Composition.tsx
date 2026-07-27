import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {AUDIO, DURATION, SECTIONS} from './constants';
import {Background} from './Background';
import {DistractorLayer} from './DistractorLayer';
import {ExclusionWindow} from './ExclusionWindow';
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

export const NeurolamBrainrotWide: React.FC = () => {
	return (
		<AbsoluteFill>
			{/* Grid background (shifts color per round) + distractors + the
			    window that keeps them out of the exclusion zone. */}
			<Background />
			<DistractorLayer />
			<ExclusionWindow />

			{/* Sparse text/UI, positioned well clear of the exclusion zone. */}
			<IntroTitle />
			<RoundTag label="ROUND 1 · WARM UP" startFrame={SECTIONS.round1.start} />
			<RoundTag label="ROUND 2 · ESCALATION" startFrame={SECTIONS.round2.start} />
			<RoundTag label="ROUND 3 · PEAK DIFFICULTY" startFrame={SECTIONS.round3.start} />
			<RoundTag label="ROUND 4 · THE CATCH" startFrame={SECTIONS.round4.start} />
			<OutroLine />
			<EndCard />

			{/* The dot + countdown: always topmost, always at dead center. */}
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
