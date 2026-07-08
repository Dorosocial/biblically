import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {EquationText} from '../EquationText';
import {Caption} from '../Caption';
import {BEATS} from '../constants';

const STAGGER = 18;
const TOKEN_COUNT = 5;

// Beat 3 (330-480, 0:11-0:16): "50 + 50 = 100?" builds in token by token.
export const Beat3: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat3.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const tokenOpacities = Array.from({length: TOKEN_COUNT}, (_, i) =>
    interpolate(frame, [i * STAGGER, i * STAGGER + 15], [0, 1], clampOpts)
  );

  return (
    <>
      <EquationText tokenOpacities={tokenOpacities} />
      <Caption
        frame={frame}
        duration={duration}
        text="A lot of people will say 50 plus 50 is 100 right?"
      />
    </>
  );
};
