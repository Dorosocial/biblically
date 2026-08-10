/**
 * SFX placeholder registry — NO audio wired up yet on purpose.
 *
 * These are the exact frame numbers (derived from the same real cue
 * timestamps everything else uses) where a sound designer should drop in an
 * effect later. Keeping them here means adding SFX later is just adding
 * <Audio> tags at these frames — no re-editing of any visual timing.
 *
 * Each entry also exists as an inline `// SFX PLACEHOLDER:` comment at the
 * matching spot in the component that renders that moment, so both the
 * "list view" (here) and the "in context" view are covered.
 */
import {CUE} from './timing';

export interface SfxCue {
  frame: number;
  moment: string;
  suggestion: string;
}

export const SFX_CUES: SfxCue[] = [
  {frame: CUE.tryTilt, moment: 'push', suggestion: 'soft push/thud as the force arrow lands on the axle'},
  {frame: CUE.insteadFalling, moment: 'freeze', suggestion: 'time-freeze whoosh / tick as the ghost comparison appears'},
  {frame: CUE.turnsSideways, moment: 'tension build (release)', suggestion: 'quick rising whoosh into a bright "swerve" sting as it turns sideways'},
  {frame: CUE.anotherCase, moment: 'whip-pan', suggestion: 'whip-pan swoosh under the dark beat / new-angle reveal'},
  {frame: CUE.flipAxis, moment: 'axis-flip', suggestion: 'mechanical turn/creak sound as the axle flips through space'},
  {frame: CUE.pushesBack, moment: 'tension build', suggestion: 'low rising tension bed as the wheel begins precessing'},
  {frame: 0, moment: 'reaction snap (computed at runtime as REACTION_FRAME)', suggestion: 'sharp snap/impact synced to the camera snap-pan'},
  {frame: CUE.holdWheel, moment: 'momentum emphasis', suggestion: 'low glowing hum/drone starting as the angular-momentum arrow appears'},
  {frame: CUE.secretAngular, moment: 'momentum emphasis', suggestion: 'swell/riser as the angular-momentum arrow becomes dominant'},
  {frame: CUE.changingMomentum, moment: 'vector sweep', suggestion: 'sweeping whoosh following the curved arrow through the 360 orbit'},
  {frame: CUE.createsTorque, moment: 'momentum emphasis', suggestion: 'accent hit as the torque vector appears perpendicular'},
  {frame: CUE.gyroscopicPrecession, moment: 'precession reveal', suggestion: 'cinematic swell/resolve as the full precession cone is revealed, resolving into the loop'},
];
