import React from 'react';
import {COLORS} from './colors';

const TOKENS = ['50', '+', '50', '=', '100?'];

// The "50 + 50 = 100?" line. Each token's opacity is controlled
// independently so beat 3 can stagger them in while beat 4 shows them all
// already visible (hard cut, no build).
export const EquationText: React.FC<{tokenOpacities: number[]}> = ({tokenOpacities}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{display: 'flex', gap: '28px'}}>
        {TOKENS.map((t, i) => (
          <span
            key={i}
            style={{
              opacity: tokenOpacities[i] ?? 1,
              fontSize: 96,
              fontWeight: 800,
              color: COLORS.bone,
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};
