import React from 'react';
import {Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {HEIGHT, WIDTH} from './constants';
import {DISTRACTOR_SOUNDS, DISTRACTOR_VIDEOS} from './assets';
import {driftValue} from './drift';
import {Exercise} from './schedule';

const DriftingVideoClip: React.FC<{src: string}> = ({src}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = 1.04 + driftValue(frame, fps * 5, 0.03);
	const x = driftValue(frame, fps * 6.5, 10, 0.7);
	const y = driftValue(frame, fps * 7.2, 8, 2.0);

	return (
		<div style={{position: 'absolute', width: WIDTH, height: HEIGHT, overflow: 'hidden'}}>
			<OffthreadVideo
				src={staticFile(src)}
				muted
				style={{
					width: WIDTH,
					height: HEIGHT,
					objectFit: 'cover',
					transform: `scale(${scale}) translate(${x}px, ${y}px)`,
					opacity: 0.85,
				}}
			/>
		</div>
	);
};

/**
 * Splits `durationInFrames` evenly across `videos.length` clips, played back
 * to back. For a single-video exercise this is just one full-window clip.
 */
const DistractorVideoSequence: React.FC<{videos: string[]; durationInFrames: number}> = ({
	videos,
	durationInFrames,
}) => {
	const slice = Math.floor(durationInFrames / videos.length);

	return (
		<>
			{videos.map((src, i) => (
				<Sequence
					key={src}
					from={i * slice}
					durationInFrames={i === videos.length - 1 ? durationInFrames - i * slice : slice}
				>
					<DriftingVideoClip src={src} />
				</Sequence>
			))}
		</>
	);
};

/**
 * Deterministically spaces short SFX hits across the window instead of
 * looping them — these are one-shot notification/alert sounds, not beds.
 */
const DistractorSoundHits: React.FC<{sounds: string[]; durationInFrames: number}> = ({
	sounds,
	durationInFrames,
}) => {
	return (
		<>
			{sounds.map((src, i) => {
				const offset = Math.round(((i + 1) / (sounds.length + 1)) * durationInFrames);

				return (
					<Sequence key={src} from={offset}>
						<Audio src={staticFile(src)} volume={1} />
					</Sequence>
				);
			})}
		</>
	);
};

interface Props {
	exercise: Exercise;
	durationInFrames: number;
}

export const ExerciseDistractors: React.FC<Props> = ({exercise, durationInFrames}) => {
	const videos = DISTRACTOR_VIDEOS[exercise];
	const sounds = DISTRACTOR_SOUNDS[exercise];

	return (
		<>
			{videos ? <DistractorVideoSequence videos={videos} durationInFrames={durationInFrames} /> : null}
			{sounds ? <DistractorSoundHits sounds={sounds} durationInFrames={durationInFrames} /> : null}
		</>
	);
};
