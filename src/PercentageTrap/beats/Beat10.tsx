import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {PriceTag} from '../PriceTag';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

// Beat 10 (1050-1140, 0:35-0:38): HARD CUT. The $50 tag lights up green —
// it's clearly the active number now.
export const Beat10: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat10.duration;

  const haloOpacity = interpolate(frame, [0, 30], [0, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <Scene>
        <rect
          x={280}
          y={520}
          width={520}
          height={280}
          rx={40}
          fill={COLORS.green}
          opacity={haloOpacity}
          filter="url(#glowGreen)"
        />
        <PriceTag amount="50" x={540} y={650} color={COLORS.green} glow />
      </Scene>
      <Caption frame={frame} duration={duration} text="It only applies to what's left." />
    </>
  );
};
