import React from 'react';
import {COLORS} from './colors';

export const Wordmark: React.FC<{opacity: number}> = ({opacity}) => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 230, textAlign: 'center', opacity}}>
    <span
      style={{
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 700,
        fontSize: 24,
        letterSpacing: 6,
        color: COLORS.green,
        textTransform: 'uppercase',
      }}
    >
      Zombie Math
    </span>
  </div>
);
