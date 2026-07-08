import React from 'react';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {Scene} from '../Scene';
import {PriceTag} from '../PriceTag';
import {Caption} from '../Caption';
import {BEATS} from '../constants';

// Beat 6 (630-690, 0:21-0:23): HARD CUT, wide reset. The $100 tag
// reappears clean and centered with a quick snap-in.
export const Beat6: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat6.duration;

  const scale = spring({frame, fps, config: {damping: 14, mass: 0.5, stiffness: 200}});

  return (
    <>
      <Scene>
        <PriceTag amount="100" x={540} y={700} scale={scale} />
      </Scene>
      <Caption frame={frame} duration={duration} text="Now this is what actually happens." />
    </>
  );
};
