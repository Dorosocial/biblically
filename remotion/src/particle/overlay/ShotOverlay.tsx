import React from 'react';
import {Shot, secToFrames} from '../timing';
import {theme} from '../theme';
import {Label, GhostText, BigWord} from './components';

/**
 * Renders one shot's HTML/CSS overlay content — short labels only, per the
 * brief. Pure function of (shot, absolute frame); Overlay.tsx handles
 * cross-fade timing via shotEnvelope().
 */
export const renderShotOverlay = (shot: Shot, frame: number): React.ReactNode => {
	const startF = secToFrames(shot.start);

	switch (shot.id) {
		case 'alreadySoundsImpossible':
			// PUNCTUATED PAUSE — SFX placeholder: soft low drone, no hard hit; a
			// continuing glow-pulse + particle shimmer keeps this from reading as
			// a dead/frozen frame (handled in Scene.tsx via particlesIntensity).
			return <GhostText text="IMPOSSIBLE?" startFrame={startF} />;

		case 'chooseLeftOrRight':
			return (
				<>
					<Label text="LEFT" startFrame={startF} x="28%" y="18%" size={50} color={theme.classicalBall} from="left" />
					<Label text="RIGHT" startFrame={startF + 4} x="72%" y="18%" size={50} color={theme.particleColor} from="right" />
				</>
			);

		case 'imagineSendingParticle':
			return <Label text="ONE PARTICLE" startFrame={startF} x="50%" y="16%" size={40} color={theme.particleColor} />;

		case 'didItSplitIntoTwo':
			// Reworked per science-accuracy note: the "wrong idea" is raised as a
			// QUESTION in text only — never rendered as two literal duplicate
			// particle-balls. The wave itself flickers ambiguously (see
			// sceneState waveSpread) rather than showing two discrete objects.
			return <GhostText text="2 PARTICLES?" startFrame={startF + 6} />;

		case 'noSingleParticle':
			// SFX placeholder: hard, dry "no" hit, then settle into a clean single tone.
			return <BigWord text="NO" startFrame={startF} color={theme.ghostBall} />;

		case 'tryFindWhichPath':
			return <Label text="WHICH PATH?" startFrame={startF} x="50%" y="14%" size={42} color={theme.detectorOn} />;

		case 'measureIt':
			// SFX placeholder: sharp detector "chirp" synced to the glow burst.
			return null;

		case 'interferenceDisappears':
			// SFX placeholder: the interference-band shimmer sound cuts out fast,
			// replaced by a flat, dry tone (bands -> two-band collapse).
			return null;

		case 'oneDefiniteResult':
			return <Label text="ONE RESULT" startFrame={startF} x="50%" y="20%" size={40} color={theme.particleColor} />;

		case 'quantumWorldDifferent':
			return (
				<>
					<Label text="CLASSICAL" startFrame={startF} x="26%" y="82%" size={34} color={theme.classicalBall} from="left" />
					<Label text="QUANTUM" startFrame={startF + 4} x="74%" y="82%" size={34} color={theme.waveColorBright} from="right" />
				</>
			);

		default:
			return null;
	}
};
