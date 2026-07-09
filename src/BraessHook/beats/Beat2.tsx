import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {NodeDot} from '../NodeDot';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROAD_LEFT, NODE_A, NODE_B, segmentPoint} from '../geometry';
import {easeOutCubic} from '../ease';

// Beat 2 (45-90, 1.5s-3s): the camera whip-pans along road_left's actual
// curved path in real time, tracking the line itself, arriving as an
// extreme close-up on node B exactly as "B" is spoken.
export const Beat2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat2.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const t = easeOutCubic(interpolate(frame, [0, duration], [0, 1], clampOpts));
  const pt = segmentPoint(ROAD_LEFT, t);
  const scale = 3.4 - 1.2 * 4 * t * (1 - t);
  const shot = {cx: pt.x, cy: pt.y, scale};

  const bPopScale = spring({
    frame: Math.max(0, frame - (duration - 12)),
    fps,
    config: {damping: 10, mass: 0.5, stiffness: 240},
  });

  return (
    <>
      <NetworkScene frame={frame} shot={shot} showNodesAB={false}>
        <NodeDot pt={NODE_A} label="A" />
        <g transform={`translate(${NODE_B.x} ${NODE_B.y}) scale(${bPopScale}) translate(${-NODE_B.x} ${-NODE_B.y})`}>
          <NodeDot pt={NODE_B} label="B" />
        </g>
      </NetworkScene>
      <Caption frame={frame} duration={duration} text="A to point B." />
    </>
  );
};
