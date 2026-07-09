import React from 'react';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {
  ROUTE_LEFT,
  ROUTE_RIGHT,
  ROUTE_MIX_VIA_M1_FIRST,
  ROUTE_MIX_VIA_M2_FIRST,
} from '../geometry';

const TAG_START = 40;

// Beat 6 (660-810, 0:22-0:27): HARD PUNCH-IN on the new road. A handful
// of dots divert onto it, fast, and a "TIME SAVED" tag springs in.
export const Beat6: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat6.duration;

  const tagFrame = Math.max(0, frame - TAG_START);
  const tagScale = spring({frame: tagFrame, fps, config: {damping: 9, mass: 0.6, stiffness: 150}});

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOTS.earlyAdoptPunch}
        showShortcut
        showMidNodes
        streams={[
          {route: ROUTE_LEFT, count: 6, speed: 0.006},
          {route: ROUTE_RIGHT, count: 6, speed: 0.006, phase: 0.5},
          {route: ROUTE_MIX_VIA_M1_FIRST, count: 3, speed: 0.014, phase: 0.15, radius: 9},
          {route: ROUTE_MIX_VIA_M2_FIRST, count: 3, speed: 0.014, phase: 0.6, radius: 9},
        ]}
      >
        {frame >= TAG_START ? (
          <g transform={`translate(540 780) scale(${tagScale})`}>
            <rect x={-150} y={-40} width={300} height={80} rx={16} fill="none" stroke={COLORS.green} strokeWidth={6} />
            <text
              x={0}
              y={2}
              fill={COLORS.green}
              fontSize={38}
              fontWeight={800}
              fontFamily="Helvetica, Arial, sans-serif"
              textAnchor="middle"
              dominantBaseline="central"
            >
              TIME SAVED
            </text>
          </g>
        ) : null}
      </NetworkScene>
      <Caption
        frame={frame}
        duration={duration}
        text="At first it works, a few drivers discover the shortcut and save time."
      />
    </>
  );
};
