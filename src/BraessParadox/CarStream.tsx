import React from 'react';
import {RouteSampler} from './geometry';
import {trafficColor} from './colors';

const frac = (x: number) => ((x % 1) + 1) % 1;

export const CarStream: React.FC<{
  route: RouteSampler;
  frame: number;
  count: number;
  speed: number; // route-fraction per frame at zero congestion
  phase?: number; // 0-1 extra offset, lets two streams interleave
  congestion?: number; // 0-1: reddens color and slows speed
  jam?: number; // 0-1: bunches dots up near the end of the route
  radius?: number;
}> = ({route, frame, count, speed, phase = 0, congestion = 0, jam = 0, radius = 9}) => {
  const color = trafficColor(congestion);
  const effectiveSpeed = speed * (1 - congestion * 0.85);

  const dots = [];
  for (let i = 0; i < count; i++) {
    const tRaw = frac(frame * effectiveSpeed + i / count + phase);
    const tEff = jam > 0 ? 1 - Math.pow(1 - tRaw, 1 + 3 * jam) : tRaw;
    const p = route(tEff);
    dots.push(
      <circle
        key={i}
        cx={p.x}
        cy={p.y}
        r={radius}
        fill={color}
        stroke="#1A1A1A"
        strokeWidth={2}
      />
    );
  }

  return <g>{dots}</g>;
};
