import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Glitch} from '../Glitch';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

// Beat 15 (960-1020, 34s-37s): HARD CUT, glitch/flash transition, brief
// screen distortion — signals a tone shift.
export const Beat15: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat15.duration;

  return (
    <>
      <Glitch frame={frame} />
      <Caption frame={frame} duration={duration} text="And that's where things get weird." color={COLORS.pink} />
    </>
  );
};
