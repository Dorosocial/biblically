import React from 'react';
import {toScreen, pointsToPathD, OUTER_WALL, INNER_WALL} from './geometry';
import {COLORS} from './colors';

// Clean, thin vector line art for the 90-degree hallway corner: an outer
// wall polyline and an inner (concave) corner wall polyline, both drawn
// in with a stroke-dashoffset reveal.
export const Hallway: React.FC<{progress?: number}> = ({progress = 1}) => {
  const outerD = pointsToPathD(OUTER_WALL.map(toScreen), false);
  const innerD = pointsToPathD(INNER_WALL.map(toScreen), false);
  const dashProps = {pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - progress};

  return (
    <g fill="none" stroke={COLORS.bone} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round">
      <path d={outerD} {...dashProps} />
      <path d={innerD} {...dashProps} />
    </g>
  );
};
