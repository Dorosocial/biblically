import React from 'react';
import {COLORS} from './colors';

export const Wordmark: React.FC<{opacity: number; bottom?: number}> = ({opacity, bottom = 320}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom,
        textAlign: 'center',
        opacity,
      }}
    >
      <span
        style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: 6,
          color: COLORS.pink,
          textTransform: 'uppercase',
        }}
      >
        Zombie Math
      </span>
    </div>
  );
};
