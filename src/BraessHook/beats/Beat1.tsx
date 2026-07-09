import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {NodeDot} from '../NodeDot';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {NODE_A, NODE_B, ROUTE_LEFT} from '../geometry';
import {easeInOutCubic} from '../ease';

const PUSH_END = 30;

// Beat 1 (0-120, 0:00-0:04): ONE confident camera move — a clean push-in
// on node A, then a single smooth whip-pan tracing road_left to node B.
// No stacked moves.
export const Beat1: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat1.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const panT = easeInOutCubic(interpolate(frame, [PUSH_END, duration], [0, 1], clampOpts));
  const pt = frame <= PUSH_END ? NODE_A : ROUTE_LEFT(panT);
  const pushScale = interpolate(frame, [0, PUSH_END], [2.0, 3.2], clampOpts);
  const panScale = interpolate(panT, [0, 0.15, 0.85, 1], [3.2, 2.4, 2.4, 3.4]);
  const scale = frame <= PUSH_END ? pushScale : panScale;
  const shot = {cx: pt.x, cy: pt.y, scale};

  const aOpacity = interpolate(frame, [0, 6], [0, 1], clampOpts);
  const bPopScale = spring({
    frame: Math.max(0, frame - (duration - 16)),
    fps,
    config: {damping: 11, mass: 0.5, stiffness: 220},
  });

  return (
    <>
      <NetworkScene frame={frame} shot={shot} showNodesAB={false}>
        <NodeDot pt={NODE_A} label="A" opacity={aOpacity} />
        <g transform={`translate(${NODE_B.x} ${NODE_B.y}) scale(${bPopScale}) translate(${-NODE_B.x} ${-NODE_B.y})`}>
          <NodeDot pt={NODE_B} label="B" />
        </g>
      </NetworkScene>
      <Caption frame={frame} duration={duration} text="A city has two roads connecting point A to point B." />
    </>
  );
};
