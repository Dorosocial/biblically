import React from 'react';
import {RouteSampler} from './geometry';
import {trafficColor} from './colors';

const frac = (x: number) => ((x % 1) + 1) % 1;

export const CarStream: React.FC<{
  route: RouteSampler;
  frame: number;
  count: number;
  speed: number;
  phase?: number;
  congestion?: number;
  jam?: number;
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
        <circle cx={p.x} cy={p.y} r={radius} fill={color} stroke="#0D0D0D" strokeWidth={1.5} />
      </g>
    );
  }

  return <g>{dots}</g>;
};

// A single tracked dot at an explicit t (not looping) — used when the
// camera itself is locked onto this exact dot, so its screen position and
// the camera target must be computed from the same formula.
export const TrackedDot: React.FC<{
  route: RouteSampler;
  t: number;
  congestion?: number;
  radius?: number;
}> = ({route, t, congestion = 0, radius = 11}) => {
  const p = route(t);
  const color = trafficColor(congestion);
  return (
    <g>
      <circle cx={p.x} cy={p.y} r={radius * 2.3} fill={color} opacity={0.28} />
      <circle cx={p.x} cy={p.y} r={radius} fill={color} stroke="#0D0D0D" strokeWidth={2} />
    </g>
  );
};
