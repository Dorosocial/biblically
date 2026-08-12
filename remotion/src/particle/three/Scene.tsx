import React from 'react';
import {useCurrentFrame} from 'remotion';
import {getSceneState} from '../sceneState';
import {getShotAtFrame} from '../timing';
import {CameraRig} from './CameraRig';
import {Lighting} from './Lighting';
import {AmbientField} from './AmbientField';
import {Particle} from './Particle';
import {ClassicalBall, GhostBall} from './ClassicalBall';
import {Barrier} from './Barrier';
import {DetectionScreen} from './DetectionScreen';
import {WaveField, Lobe} from './WaveField';
import {Detectors} from './Detectors';
import {HumanScaleRef} from './HumanScaleRef';

const SLITS_SHOTS = new Set([
	'particleCanExistSuperposition',
	'getsReallyStrange',
	'imagineSendingParticle',
	'chooseLeftOrRight',
	'dontMeasureWhichPath',
	'resultsFormInterferencePattern',
	'almostWentThroughBothPaths',
	'didItSplitIntoTwo',
	'strangestPartWaveFunction',
	'spreadMultiplePossibilities',
	'tryFindWhichPath',
	'measureIt',
	'interferenceDisappears',
]);

const slitsLobes: Lobe[] = [
	{pos: [-0.5, 0, -1.6], weight: 1, size: 1.0, side: -1, phase: 0.3},
	{pos: [0.5, 0, -1.6], weight: 1, size: 1.0, side: 1, phase: 1.9},
	{pos: [-0.85, 0, -3.2], weight: 0.7, size: 0.75, side: -1, phase: 2.4},
	{pos: [0.85, 0, -3.2], weight: 0.7, size: 0.75, side: 1, phase: 0.9},
];

const cloudLobes = (center: [number, number, number]): Lobe[] => {
	const offsets: [number, number, number][] = [
		[-0.9, 0.3, 0.2],
		[0.8, -0.2, 0.5],
		[0.2, 0.6, -0.6],
		[-0.5, -0.5, -0.4],
		[1.0, 0.1, -0.3],
		[-1.0, -0.1, 0.6],
	];
	return offsets.map((o, i) => ({
		pos: [center[0] + o[0], center[1] + o[1], center[2] + o[2]],
		weight: 0.75,
		size: 0.7,
		phase: i * 1.3,
	}));
};

/** All persistent 3D content for the whole 72.8s film. */
export const Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const s = getSceneState(frame);
	const shot = getShotAtFrame(frame);

	const useSlits = SLITS_SHOTS.has(shot.id);

	let waveCorePos: [number, number, number] = [0, 0, -0.3];
	let lobes: Lobe[] = slitsLobes;

	if (!useSlits) {
		if (shot.id === 'somethingStranger') waveCorePos = [-1.6, 0, 3];
		else if (shot.id === 'quantumWorldDifferent') waveCorePos = [2.2, 0, 3];
		else if (shot.id === 'tinyParticlesDontBehave') waveCorePos = [0, 0, 3];
		else waveCorePos = [0, 0, 3];
		lobes = cloudLobes(waveCorePos);
	}

	return (
		<>
			<CameraRig />
			<Lighting />
			<AmbientField intensity={s.particlesIntensity} />

			<HumanScaleRef />

			<Particle position={s.particlePos} opacity={s.particleOpacity} seed={0} />

			<ClassicalBall position={s.ballPos} opacity={s.ballOpacity} />
			<GhostBall position={[1.6, 0, 3]} opacity={s.ghostOpacity} />

			<Barrier opacity={s.apparatusOpacity} />
			<DetectionScreen opacity={s.apparatusOpacity} interferenceAmount={s.screenInterferenceAmount} collapseMix={s.screenCollapseMix} />
			<Detectors opacity={s.detectorOpacity} glow={s.detectorGlow} activeSide={s.detectorActiveSide} />

			<WaveField opacity={s.waveOpacity} spread={s.waveSpread} corePos={waveCorePos} lobes={lobes} lobeBias={s.waveLobeBias} />
		</>
	);
};
