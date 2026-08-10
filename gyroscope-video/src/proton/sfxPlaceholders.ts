/**
 * SFX placeholder registry — NO audio wired up yet on purpose.
 *
 * These are the exact frame numbers (derived from the same real cue
 * timestamps everything else uses) where a sound designer should drop in
 * an effect later. Each also exists as an inline `// SFX PLACEHOLDER:`
 * comment at the matching spot in physics.ts, so both the "list view"
 * (here) and the "in context" view are covered.
 */
import {CUE} from './timing';

export interface SfxCue {
  frame: number;
  moment: string;
  suggestion: string;
}

export const SFX_CUES: SfxCue[] = [
  {frame: CUE.protonToBasketball, moment: 'scale change', suggestion: 'deep whoosh/impact as the proton swells to basketball size'},
  {frame: CUE.basketballToEarth, moment: 'scale change', suggestion: 'massive rushing whoosh for the reverse zoom to planetary scale'},
  {frame: CUE.numberTyping, moment: 'number-typing', suggestion: 'soft rapid ticks synced to each digit, collapsing into a whoosh at scientific notation'},
  {frame: CUE.hairCut, moment: 'hard cut', suggestion: 'sharp cut sting into the hair close-up'},
  {frame: CUE.tunnelZoom, moment: 'tunnel dive', suggestion: 'accelerating whoosh/riser, pitch climbing toward atomsReveal'},
  {frame: CUE.nucleusToProton, moment: 'punch-in', suggestion: 'fast whoosh with a hard stop/thud landing exactly on the highlighted proton'},
  {frame: CUE.freezeReset, moment: '36-39s-style freeze (real cue ~51.4s)', suggestion: 'everything drops out — silence or a sub-bass drone under "BUT LOOK AT THE EMPTY SPACE"'},
  {frame: CUE.reverseToEmptySpace, moment: 'scale change', suggestion: 'long rushing pull-back whoosh revealing the atom’s emptiness'},
  {frame: CUE.explosiveReverseZoom, moment: 'explosive reverse zoom', suggestion: 'six rapid-fire whoosh hits, one per scale stand-in'},
  {frame: CUE.finalPullToDarkness, moment: 'final pull to darkness', suggestion: 'fading rumble resolving to silence right before the loop cut'},
];
