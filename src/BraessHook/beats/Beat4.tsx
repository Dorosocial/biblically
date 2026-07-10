import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {BigText} from '../BigText';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';
import {ROUTE_LEFT, ROUTE_RIGHT, SHORTCUT, segmentPoint} from '../geometry';

const TEXT_END = 55;
const DRAW_END_PROGRESS = 0.55;

const PHRASES = [
  {at: 0, words: [{text: 'MORE'}, {text: 'ROADS'}, {text: '='}]},
  {at: 45, words: [{text: 'LESS'}, {text: 'TRAFFIC?'}]},
  {at: 95, words: [{text: 'AT'}, {text: 'FIRST'}]},
  {at: 125, words: [{text: 'IT'}, {text: 'WORKS', accent: true}]},
];

// Beat 4 (450-600, 0:15-0:20): "MORE ROADS = LESS TRAFFIC?" appears, then
// one hard cut into the shortcut drawing in — the camera follows the
// leading edge steadily, a single unhurried tracking move.
export const Beat4: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = 150;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const textOpacity = interpolate(frame, [0, 10], [0, 1], clampOpts);
  const drawProgress = interpolate(frame, [TEXT_END, duration], [0, DRAW_END_PROGRESS], clampOpts);
  const leadPt = segmentPoint(SHORTCUT, drawProgress);
  const shot = {cx: leadPt.x, cy: leadPt.y, scale: 2.5};

  return (
    <>
      {frame < TEXT_END ? (
        <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      ) : (
        <NetworkScene
          frame={frame}
          shot={shot}
          showShortcut
          shortcutProgress={drawProgress}
          showMidNodes={drawProgress > 0.05}
          streams={[
            {route: ROUTE_LEFT, count: 8, speed: 0.006},
            {route: ROUTE_RIGHT, count: 8, speed: 0.006, phase: 0.5},
          ]}
        />
      )}
      {frame < TEXT_END ? (
        <BigText
          lines={[
            {text: 'MORE ROADS =', opacity: textOpacity, color: COLORS.bone, fontSize: 66},
            {text: 'LESS TRAFFIC?', opacity: textOpacity, color: COLORS.pink, fontSize: 66, glow: true},
          ]}
        />
      ) : null}
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
