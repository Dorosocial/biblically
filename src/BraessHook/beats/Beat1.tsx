import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {Camera} from '../Camera';
import {NodeDot} from '../NodeDot';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {NODE_A} from '../geometry';

const SHOT = {cx: NODE_A.x, cy: NODE_A.y, scale: 3.4};

// Beat 1 (0-45, 0:00-1.5s): SNAP ZOOM — camera is already locked extreme
// tight on node A the instant it appears. No zoom animation; the cut
// itself is the zoom.
export const Beat1: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat1.duration;

  const popScale = spring({frame, fps, config: {damping: 12, mass: 0.5, stiffness: 220}});
  const opacity = interpolate(frame, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <>
      <Scene>
        <Camera shot={SHOT}>
          <g transform={`translate(${NODE_A.x} ${NODE_A.y}) scale(${popScale}) translate(${-NODE_A.x} ${-NODE_A.y})`}>
            <NodeDot pt={NODE_A} label="A" opacity={opacity} />
          </g>
        </Camera>
      </Scene>
      <Caption frame={frame} duration={duration} text="A city has two roads connecting point" />
    </>
  );
};
