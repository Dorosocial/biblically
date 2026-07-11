import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {NumberText} from '../NumberText';
import {BigText} from '../BigText';
import {Wordmark} from '../Wordmark';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';
import {easeInExpo} from '../ease';

const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const PHRASES = [
  {at: 0, words: [{text: 'YES'}, {text: 'YOU'}, {text: 'COULD'}]},
  {at: 25, words: [{text: 'COUNT'}, {text: 'FOREVER'}]},
  {at: 50, words: [{text: 'BUT'}, {text: "YOU'D"}, {text: 'NEVER'}]},
  {at: 75, words: [{text: 'REACH'}, {text: 'THE'}, {text: 'END'}]},
  {at: 100, words: [{text: 'BECAUSE...'}]},
];

// Beat 4 (900-1050, 0:30-0:35): the count keeps racing upward, dim in
// the background, then fades away entirely as "THERE ISN'T ONE" holds
// as the final word and the Zombie Math wordmark settles in.
export const Beat4: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const bgCount = 1000000000001 + (5000000000000000 - 1000000000001) * easeInExpo(interpolate(frame, [0, 150], [0, 1], clampOpts));
  const bgOpacity = interpolate(frame, [0, 30, 85], [0.22, 0.22, 0], clampOpts);

  const heroOpacity = interpolate(frame, [105, 125], [0, 1], clampOpts);
  const heroScale = spring({frame: Math.max(0, frame - 105), fps, config: {damping: 13, mass: 0.5, stiffness: 190}});
  const wordmarkOpacity = interpolate(frame, [125, 150], [0, 0.85], clampOpts);

  return (
    <>
      <Scene>
        <NumberText value={bgCount} opacity={bgOpacity} color={COLORS.boneDim} fontSize={90} y={-100} />
      </Scene>
      <BigText lines={[{text: "THERE ISN'T ONE", opacity: heroOpacity, scale: heroScale, color: COLORS.bone, fontSize: 68}]} />
      <Wordmark opacity={wordmarkOpacity} />
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
