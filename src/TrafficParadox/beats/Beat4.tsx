import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Lightbulb} from '../Lightbulb';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';

// Beat 4 (450-570, 0:15-0:19): a lightbulb pulses above the city, then
// the shortcut draws itself in and glows on completion.
export const Beat4: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat4.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const bulbPulse = 0.5 + 0.5 * Math.sin(frame / 8);
  const shortcutProgress = interpolate(frame, [20, 95], [0, 1], clampOpts);
  const shortcutCongestion = shortcutProgress > 0.9 ? 0 : 0;

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOTS.wide}
        showShortcut
        shortcutProgress={shortcutProgress}
        shortcutCongestion={shortcutCongestion}
        showMidNodes={shortcutProgress > 0.05}
        streams={[
          {route: ROUTE_LEFT, count: 9, speed: 0.006},
          {route: ROUTE_RIGHT, count: 9, speed: 0.006, phase: 0.5},
        ]}
      >
        <Lightbulb x={540} y={140} pulse={bulbPulse} />
      </NetworkScene>
      <Caption frame={frame} duration={duration} text="So the city has an idea, build a new shortcut." />
    </>
  );
};
