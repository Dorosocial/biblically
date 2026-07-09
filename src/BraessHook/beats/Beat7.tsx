import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Flash} from '../Flash';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT, SHORTCUT, segmentPoint} from '../geometry';
import {shakeOffset, flashOpacityAt} from '../shake';

const CONNECT_FRAME = 18;

// Beat 7 (600-660, 0:20-0:22): the shortcut finishes connecting — the ONE
// moment in the whole video with screen-shake and an impact flash. Every
// other beat is clean, no shake.
export const Beat7: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat7.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const drawProgress = interpolate(frame, [0, CONNECT_FRAME], [0.7, 1], clampOpts);
  const leadPt = segmentPoint(SHORTCUT, drawProgress);
  const shake = shakeOffset(frame, CONNECT_FRAME, 16, 12);
  const scale = interpolate(frame, [0, duration], [2.5, 2.2], clampOpts);
  const shot = {cx: leadPt.x + shake.x, cy: leadPt.y + shake.y, scale};
  const flash = flashOpacityAt(frame, CONNECT_FRAME, 0.55, 8);

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut
        shortcutProgress={drawProgress}
        showMidNodes
        streams={[
          {route: ROUTE_LEFT, count: 8, speed: 0.006},
          {route: ROUTE_RIGHT, count: 8, speed: 0.006, phase: 0.5},
        ]}
      />
      <Flash opacity={flash} />
      <Caption frame={frame} duration={duration} text="mean less traffic, right?" />
    </>
  );
};
