import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {TusiScene} from '../TusiScene';
import {TitleBlock} from '../TitleBlock';
import {Wordmark} from '../Wordmark';
import {FINAL_ANGLE} from '../motion';

// Beat 6 (630-840, 0:21-0:28): the diagram dims to a quiet backdrop as
// the title card takes over — "TUSI COUPLE" fades in, then the
// attribution line, then the Zombie Math wordmark settles in subtly.
// Holds as the final frame.
export const Beat6: React.FC = () => {
  const frame = useCurrentFrame();
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const diagramOpacity = interpolate(frame, [0, 40], [1, 0.22], clampOpts);
  const titleOpacity = interpolate(frame, [20, 55], [0, 1], clampOpts);
  const subOpacity = interpolate(frame, [55, 85], [0, 1], clampOpts);
  const wordmarkOpacity = interpolate(frame, [110, 160], [0, 0.85], clampOpts);

  return (
    <>
      <TusiScene t={FINAL_ANGLE} showPoint diagramOpacity={diagramOpacity} />
      <TitleBlock opacity={titleOpacity} subOpacity={subOpacity} />
      <Wordmark opacity={wordmarkOpacity} />
    </>
  );
};
