import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Wordmark} from '../Wordmark';
import {PhraseCaption} from '../PhraseCaption';
import {ROUTE_LEFT, ROUTE_RIGHT, SHORTCUT, segmentPoint} from '../geometry';
import {lerpShot} from '../ease';
import {COLORS} from '../colors';

const ERASE_END = 55;
const PULLBACK_END = 95;
const FINAL_SHOT = {cx: 540, cy: 1060, scale: 1};

const PHRASES = [
  {at: 0, words: [{text: 'SOMETIMES'}, {text: 'REMOVING'}, {text: 'A'}, {text: 'ROAD'}]},
  {at: 50, words: [{text: 'CAN'}, {text: 'MAKE'}, {text: 'TRAFFIC'}]},
  {at: 100, words: [{text: 'FLOW'}, {text: 'FASTER', accent: true}]},
];

// Beat 12 (2130-2370, 1:11-1:19): the camera follows the shortcut as it
// visibly erases (reverse of its earlier draw-in), pulls back to the
// final wide frame as both roads return to green, then holds while the
// ZOMBIE MATH wordmark settles in.
export const Beat12: React.FC = () => {
  const frame = useCurrentFrame();
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const eraseProgress = interpolate(frame, [5, ERASE_END], [1, 0], clampOpts);
  const leadPt = segmentPoint(SHORTCUT, eraseProgress);
  const eraseShot = {cx: leadPt.x, cy: leadPt.y, scale: 2.4};

  const pullbackT = interpolate(frame, [ERASE_END, PULLBACK_END], [0, 1], clampOpts);
  const shot = lerpShot(eraseShot, FINAL_SHOT, pullbackT);

  const congestion = interpolate(frame, [0, PULLBACK_END], [1, 0], clampOpts);
  const wordmarkOpacity = interpolate(frame, [PULLBACK_END + 20, PULLBACK_END + 55], [0, 1], clampOpts);

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut={eraseProgress > 0.01}
        shortcutProgress={eraseProgress}
        shortcutCongestion={congestion}
        leftCongestion={congestion}
        rightCongestion={congestion}
        streams={[
          {route: ROUTE_LEFT, count: 9, speed: 0.006, congestion},
          {route: ROUTE_RIGHT, count: 9, speed: 0.006, phase: 0.5, congestion},
        ]}
      />
      <Wordmark opacity={wordmarkOpacity} />
      <PhraseCaption frame={frame} phrases={PHRASES} y={1300} accentColor={COLORS.yellow} />
    </>
  );
};
