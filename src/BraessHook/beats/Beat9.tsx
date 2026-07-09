import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Flash} from '../Flash';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT, SHORTCUT, segmentPoint} from '../geometry';
import {shakeOffset, flashOpacityAt} from '../shake';

const DRAW_END = 68;

// Beat 9 (480-570, 16s-19s): the camera FOLLOWS the shortcut drawing
// itself in — tracking the leading edge of the line as it draws — with a
// hard impact/flash when it connects.
export const Beat9: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat9.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const drawProgress = interpolate(frame, [4, DRAW_END], [0, 1], clampOpts);
  const leadPt = segmentPoint(SHORTCUT, drawProgress);
  const shake = shakeOffset(frame, DRAW_END, 14, 12);

  const pullback = interpolate(frame, [DRAW_END, duration], [0, 1], clampOpts);
  const scale = 2.6 - 0.9 * pullback;
  const cx = leadPt.x * (1 - pullback) + 540 * pullback + shake.x;
  const cy = leadPt.y * (1 - pullback) + 890 * pullback + shake.y;
  const shot = {cx, cy, scale};

  const flash = flashOpacityAt(frame, DRAW_END, 0.55, 8);

  return (
    <>
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
      <Flash opacity={flash} />
      <Caption frame={frame} duration={duration} text="build a new shortcut." />
    </>
  );
};
