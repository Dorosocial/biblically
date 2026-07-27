import React from 'react';
import {DistractorSpec} from './types';
import {resolveTransform} from './transform';
import {FlashCircle} from './distractors/FlashCircle';
import {FlashTriangle} from './distractors/FlashTriangle';
import {FlashBar} from './distractors/FlashBar';
import {FlashText} from './distractors/FlashText';
import {ParticleBurst} from './distractors/ParticleBurst';
import {GlitchShift} from './distractors/GlitchShift';
import {StrobeBurst} from './distractors/StrobeBurst';
import {GradientBurst} from './distractors/GradientBurst';
import {PatternFlash} from './distractors/PatternFlash';

export const Distractor: React.FC<{spec: DistractorSpec; frame: number}> = ({
	spec,
	frame,
}) => {
	const tr = resolveTransform(spec, frame);

	switch (spec.type) {
		case 'circle':
			return <FlashCircle spec={spec} tr={tr} />;
		case 'triangle':
			return <FlashTriangle spec={spec} tr={tr} />;
		case 'bar':
			return <FlashBar spec={spec} tr={tr} />;
		case 'text':
			return <FlashText spec={spec} tr={tr} />;
		case 'particle':
			return <ParticleBurst spec={spec} tr={tr} />;
		case 'glitch':
			return <GlitchShift spec={spec} tr={tr} />;
		case 'strobe':
			return <StrobeBurst spec={spec} tr={tr} />;
		case 'gradient':
			return <GradientBurst spec={spec} tr={tr} />;
		case 'pattern':
			return <PatternFlash spec={spec} tr={tr} />;
		default:
			return null;
	}
};
