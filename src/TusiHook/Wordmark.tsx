import React from 'react';
import {COLORS} from './colors';

// Subtle — this composition is understated, not a loud hook video, so the
// channel wordmark sits small and dim rather than glowing.
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
