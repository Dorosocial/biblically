import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {TrackedDot} from '../CarStream';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT, ROUTE_MIX_VIA_M1_FIRST} from '../geometry';
import {COLORS} from '../colors';
import {easeInOutCubic} from '../ease';

const TAG_START = 90;

// Beat 8 (660-810, 0:22-0:27): the camera follows ONE car dot as it
// discovers and turns onto the shortcut; a "TIME SAVED" tag pops in
// cleanly once it's through.
export const Beat8: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat8.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const trackedT = easeInOutCubic(interpolate(frame, [0, duration], [0.05, 0.62], clampOpts));
  const dotPos = ROUTE_MIX_VIA_M1_FIRST(trackedT);
  const shot = {cx: dotPos.x, cy: dotPos.y, scale: 2.3};

  const tagOpacity = interpolate(frame, [TAG_START, TAG_START + 12], [0, 1], clampOpts);

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut
        showMidNodes
        streams={[
          {route: ROUTE_LEFT, count: 6, speed: 0.006},
          {route: ROUTE_RIGHT, count: 6, speed: 0.006, phase: 0.5},
        ]}
      >
        <TrackedDot route={ROUTE_MIX_VIA_M1_FIRST} t={trackedT} radius={13} />
        <g opacity={tagOpacity} transform={`translate(${dotPos.x} ${dotPos.y - 70})`}>
          <rect x={-96} y={-34} width={192} height={56} rx={12} fill="none" stroke={COLORS.green} strokeWidth={4} />
          <text x={0} y={0} fill={COLORS.green} fontSize={26} fontWeight={800} textAnchor="middle" dominantBaseline="central">
            TIME SAVED
          </text>
        </g>
      </NetworkScene>
      <Caption
        frame={frame}
        duration={duration}
        text="At first it works — a few drivers discover the shortcut and save time."
      />
    </>
  );
};
