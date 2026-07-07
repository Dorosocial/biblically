import React from 'react';

export const Road: React.FC<{
  d: string;
  color: string;
  width?: number;
  progress?: number; // 0-1 stroke reveal (draw-in animation)
  opacity?: number;
  glow?: boolean;
}> = ({d, color, width = 14, progress = 1, opacity = 1, glow = false}) => {
  return (
    <g opacity={opacity}>
      {/* casing gives the line-art road some depth */}
      <path
        d={d}
        fill="none"
        stroke="#000000"
        strokeOpacity={0.35}
        strokeWidth={width + 10}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
        filter={glow ? 'url(#roadGlow)' : undefined}
      />
    </g>
  );
};
