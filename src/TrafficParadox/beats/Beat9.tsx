import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Glitch} from '../Glitch';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

// Beat 9 (1020-1110, 0:34-0:37): HARD CUT with a brief glitch/flash —
// signals a tone shift into the "why" of the paradox.
export const Beat9: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat9.duration;

  return (
    <>
      <Glitch frame={frame} />
      <Caption
        frame={frame}
        duration={duration}
        text="And that's where things get weird."
        color={COLORS.pink}
      />
    </>
  );
};
