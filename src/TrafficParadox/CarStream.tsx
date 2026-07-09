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
}> = ({route, frame, count, speed, phase = 0, congestion = 0, jam = 0, radius = 8}) => {
  const color = trafficColor(congestion);
  const effectiveSpeed = speed * (1 - congestion * 0.85);

  const dots = [];
  for (let i = 0; i < count; i++) {
    const tRaw = frac(frame * effectiveSpeed + i / count + phase);
    const tEff = jam > 0 ? 1 - Math.pow(1 - tRaw, 1 + 3 * jam) : tRaw;
    const p = route(tEff);
    dots.push(
      <g key={i}>
        <circle cx={p.x} cy={p.y} r={radius * 2.1} fill={color} opacity={0.22} />
        <circle cx={p.x} cy={p.y} r={radius} fill={color} stroke={'#0D0D0D'} strokeWidth={1.5} />
      </g>
    );
  }

  return <g>{dots}</g>;
};
