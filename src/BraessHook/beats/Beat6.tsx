import React from 'react';
import {useCurrentFrame} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {Road} from '../Road';
import {NodeDot} from '../NodeDot';
import {CarStream} from '../CarStream';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {WIDTH, HEIGHT} from '../constants';
import {BEATS} from '../constants';
import {PATH_D, ROUTE_LEFT, ROUTE_RIGHT, ROAD_LEFT, ROAD_RIGHT, NODE_B, segmentPoint} from '../geometry';

const SCALE = 2.8;
const leftApproach = segmentPoint(ROAD_LEFT, 0.9);
const rightApproach = segmentPoint(ROAD_RIGHT, 0.9);

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
        <CarStream route={ROUTE_LEFT} frame={frame} count={8} speed={0.006} />
        <CarStream route={ROUTE_RIGHT} frame={frame} count={8} speed={0.006} phase={0.5} />
        <NodeDot pt={NODE_B} label="B" />
      </g>
    </svg>
  );
};

// Beat 6 (300-360, 10s-12s): split-screen snap — left tight on road_left's
// approach to B, right tight on road_right's approach to B, both arriving
// at once.
export const Beat6: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat6.duration;

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
        <Half frame={frame} centerX={270} target={leftApproach} clip="inset(0 50% 0 0)" />
        <Half frame={frame} centerX={810} target={rightApproach} clip="inset(0 0 0 50%)" />
        <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 4, backgroundColor: COLORS.bone, opacity: 0.55, transform: 'translateX(-2px)'}} />
      </AbsoluteFill>
      <Caption frame={frame} duration={duration} text="and everyone gets there in about the same amount of time." />
    </>
  );
};
