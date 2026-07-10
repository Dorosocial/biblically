import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {PhraseCaption} from '../PhraseCaption';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST} from '../geometry';
import {easeOutCubic} from '../ease';

const START = {cx: 540, cy: 890, scale: 2.0};
const WIDE = {cx: 540, cy: 910, scale: 1.15};

const PHRASES = [
  {at: 0, words: [{text: 'ALMOST'}, {text: 'EVERY'}, {text: 'DRIVER'}]},
  {at: 40, words: [{text: 'CHOOSES'}, {text: 'THE'}, {text: 'FASTER'}, {text: 'ROUTE', accent: true}]},
  {at: 85, words: [{text: "THAT'S"}, {text: 'WHERE...'}]},
];

// Beat 6 (780-900, 0:26-0:30): a single pull-back to wide reveals the
// mass of drivers converging on the shortcut.
export const Beat6: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = 120;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const t = easeOutCubic(interpolate(frame, [0, duration], [0, 1], clampOpts));
  const shot = {
    cx: START.cx + (WIDE.cx - START.cx) * t,
    cy: START.cy + (WIDE.cy - START.cy) * t,
    scale: START.scale + (WIDE.scale - START.scale) * t,
  };

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut
        showMidNodes
        streams={[
          {route: ROUTE_MIX_VIA_M1_FIRST, count: 10, speed: 0.011, phase: 0.15, radius: 9},
          {route: ROUTE_MIX_VIA_M2_FIRST, count: 10, speed: 0.011, phase: 0.6, radius: 9},
        ]}
      />
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
