import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Road} from '../Road';
import {NodeDot} from '../NodeDot';
import {CarStream} from '../CarStream';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {WIDTH, HEIGHT, BEATS} from '../constants';
import {PATH_D, ROUTE_LEFT, ROUTE_RIGHT, ROAD_LEFT, ROAD_RIGHT, NODE_B, segmentPoint} from '../geometry';

const SCALE = 2.4;
const leftApproach = segmentPoint(ROAD_LEFT, 0.9);
const rightApproach = segmentPoint(ROAD_RIGHT, 0.9);
const SPLIT_END = 100;
const WIDE_SHOT = {cx: 540, cy: 910, scale: 1.05};

const Half: React.FC<{frame: number; centerX: number; target: {x: number; y: number}; clip: string}> = ({
  frame,
  centerX,
  target,
  clip,
}) => {
  const tx = centerX - target.x * SCALE;
  const ty = HEIGHT / 2 - target.y * SCALE;
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      style={{position: 'absolute', top: 0, left: 0, clipPath: clip}}
    >
      <g transform={`translate(${tx} ${ty}) scale(${SCALE})`}>
        <Road d={PATH_D.roadLeft} color={COLORS.green} />
        <Road d={PATH_D.roadRight} color={COLORS.green} />
        <CarStream route={ROUTE_LEFT} frame={frame} count={7} speed={0.006} />
        <CarStream route={ROUTE_RIGHT} frame={frame} count={7} speed={0.006} phase={0.5} />
        <NodeDot pt={NODE_B} label="B" />
      </g>
    </svg>
  );
};

// Beat 4 (300-450, 0:10-0:15): a single split-screen comparison of both
// roads' travel time, then one clean transition back to the wide shot —
// one distinct action, not stacked moves.
export const Beat4: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat4.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
  const splitOpacity = interpolate(frame, [SPLIT_END, SPLIT_END + 14], [1, 0], clampOpts);

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={WIDE_SHOT}
        streams={[
          {route: ROUTE_LEFT, count: 9, speed: 0.006},
          {route: ROUTE_RIGHT, count: 9, speed: 0.006, phase: 0.5},
        ]}
      />
      {splitOpacity > 0.01 ? (
        <AbsoluteFill style={{backgroundColor: COLORS.bg, opacity: splitOpacity}}>
          <Half frame={frame} centerX={270} target={leftApproach} clip="inset(0 50% 0 0)" />
          <Half frame={frame} centerX={810} target={rightApproach} clip="inset(0 0 0 50%)" />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: COLORS.bone,
              opacity: 0.55,
              transform: 'translateX(-2px)',
            }}
          />
        </AbsoluteFill>
      ) : null}
      <Caption
        frame={frame}
        duration={duration}
        text="the two routes, and everyone gets there in about the same amount of time."
      />
    </>
  );
};
