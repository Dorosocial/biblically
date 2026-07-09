import React from 'react';
import {COLORS} from './colors';

// Full-screen impact flash overlay.
export const Flash: React.FC<{opacity: number; color?: string}> = ({
  opacity,
  color = COLORS.bone,
}) => {
  if (opacity <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: color,
        opacity,
      }}
    />
  );
};
