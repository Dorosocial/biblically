import React from 'react';

// Neon glow via layered strokes (wide+dim, mid, bright core) rather than
// an SVG feGaussianBlur filter. A filter with objectBoundingBox units
// clips to nothing on a perfectly horizontal/vertical zero-height shape —
// layered strokes sidestep that failure mode entirely and are cheaper.
export const Road: React.FC<{
  d: string;
  color: string;
  width?: number;
  progress?: number; // 0-1 stroke reveal (draw-in / erase animation)
  opacity?: number;
}> = ({d, color, width = 12, progress = 1, opacity = 1}) => {
  const dashProps = {
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1 - progress,
  };

  return (
    <g opacity={opacity}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeOpacity={0.16}
        strokeWidth={width * 3.4}
        strokeLinecap="round"
        {...dashProps}
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeOpacity={0.32}
        strokeWidth={width * 1.9}
        strokeLinecap="round"
        {...dashProps}
      />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" {...dashProps} />
    </g>
  );
};
