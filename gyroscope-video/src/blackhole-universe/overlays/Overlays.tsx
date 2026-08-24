import React from 'react';
import {SceneState} from '../physics';

/**
 * On-screen text/diagram overlays — but NOT narration captions. Per the
 * brief: no caption bar, no subtitle text following the voiceover anywhere
 * in this video. Only specific beats that explicitly call for on-screen
 * diagram text (equations, "∞" symbols, "HYPOTHESIS → PREDICTION → TEST")
 * render anything here — those get added when their sections are built.
 * Section 1 has no such beats, so this is a no-op for now.
 */
export const Overlays: React.FC<{frame: number; s: SceneState}> = () => {
  return null;
};
