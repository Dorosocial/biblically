import React from 'react';
import {Pt, rotateAboutPivot, toScreen, pointsToPathD} from './geometry';

// Renders a sofa shape (a closed polygon in hallway-unit local space)
// rotated by `theta` about the corner pivot, in screen space. `glow`
// layers extra dim, wider strokes beneath the crisp outline instead of an
// SVG blur filter — a filter's objectBoundingBox region clips to nothing
// on a zero-height/width shape, and even for shapes that don't hit that
// bug it's simpler to stay consistent with the layered-stroke technique.
export const SofaShape: React.FC<{
  localPoints: Pt[];
  theta: number;
  color: string;
  fillOpacity?: number;
  strokeWidth?: number;
  opacity?: number;
  glow?: boolean;
}> = ({localPoints, theta, color, fillOpacity = 0.14, strokeWidth = 3, opacity = 1, glow = false}) => {
  const screenPts = localPoints.map((p) => toScreen(rotateAboutPivot(p, theta)));
  const d = pointsToPathD(screenPts, true);

  return (
    <g opacity={opacity}>
      {glow ? (
        <>
          <path d={d} fill="none" stroke={color} strokeOpacity={0.14} strokeWidth={strokeWidth * 4} />
          <path d={d} fill="none" stroke={color} strokeOpacity={0.28} strokeWidth={strokeWidth * 2.2} />
        </>
      ) : null}
      <path d={d} fill={color} fillOpacity={fillOpacity} stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </g>
  );
};
