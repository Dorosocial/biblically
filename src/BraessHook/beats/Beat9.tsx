import React from 'react';
import {useCurrentFrame} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {RippleEffect} from '../RippleEffect';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {
  ROUTE_LEFT,
  ROUTE_RIGHT,
  ROUTE_MIX_VIA_M1_FIRST,
  ROUTE_MIX_VIA_M2_FIRST,
  NODE_M1,
  NODE_M2,
} from '../geometry';

const SHOT = {cx: (NODE_M1.x + NODE_M2.x) / 2, cy: (NODE_M1.y + NODE_M2.y) / 2, scale: 2.0};

// Beat 9 (810-900, 0:27-0:30): the camera holds steady, tracking a ripple
// as it spreads outward from the shortcut.
export const Beat9: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat9.duration;

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOT}
        showShortcut
        showMidNodes
        streams={[
          {route: ROUTE_LEFT, count: 6, speed: 0.006},
          {route: ROUTE_RIGHT, count: 6, speed: 0.006, phase: 0.5},
          {route: ROUTE_MIX_VIA_M1_FIRST, count: 4, speed: 0.012, phase: 0.15, radius: 9},
          {route: ROUTE_MIX_VIA_M2_FIRST, count: 4, speed: 0.012, phase: 0.6, radius: 9},
        ]}
      >
        <RippleEffect cx={SHOT.cx} cy={SHOT.cy} frame={frame} />
      </NetworkScene>
      <Caption frame={frame} duration={duration} text="But then, everyone notices." />
    </>
  );
};
