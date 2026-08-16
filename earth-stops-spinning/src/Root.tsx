import React from 'react';
import {Composition} from 'remotion';
import {EarthStopsSpinningComposition, TOTAL_DURATION} from './EarthStopsSpinningComposition';

// Landscape 1920x1080 / 30fps -- no aspect ratio was specified for this
// channel, so this is a plain default; change here if the channel settles
// on something else (e.g. 9:16 for shorts) and every scene inherits it.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="EarthStopsSpinning"
      component={EarthStopsSpinningComposition}
      durationInFrames={TOTAL_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
