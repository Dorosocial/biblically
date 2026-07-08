import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {PriceTag} from '../PriceTag';
import {Caption} from '../Caption';
import {BEATS} from '../constants';

// Beat 9 (870-1050, 0:29-0:35): HARD CUT back to the original $100 tag,
// now struck through — it no longer applies.
export const Beat9: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat9.duration;

  const strikeProgress = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <Scene>
        <PriceTag amount="100" x={540} y={700} strikeProgress={strikeProgress} />
      </Scene>
      <Caption
        frame={frame}
        duration={duration}
        text="But the second 50% off doesn't apply to the original $100 anymore."
      />
    </>
  );
};
