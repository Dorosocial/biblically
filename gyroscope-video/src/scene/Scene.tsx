import React from 'react';
import {heroDir, heroSpinAngle, comparisonState, fallGhosts, spinArcVisible, WHEEL_RADIUS} from '../physics';
import {Wheel} from './Wheel';
import {SpinArc} from './SpinArc';
import {Lighting} from './Lighting';
import {CameraRig} from '../camera/CameraRig';
import {CUE} from '../timing';

/**
 * Deliberately minimal: the wheel(s), the ghost wheels for the KEY
 * "expected vs. actual" shot, and exactly one arrow — the glowing
 * angular-velocity arc hugging the rim. No straight vector arrows, no
 * trail lines; the wheel's own motion (plus the camera language) carries
 * the story.
 */
export const Scene: React.FC<{frame: number}> = ({frame}) => {
  const heroVisible = !(frame >= CUE.whatIfFaster && frame < CUE.anotherCase);
  const dir = heroDir(frame);
  const spin = heroSpinAngle(frame);
  const cmp = comparisonState(frame);
  const ghosts = fallGhosts(frame);

  return (
    <>
      <Lighting />
      <CameraRig frame={frame} />

      {heroVisible && <Wheel dir={dir} spinAngle={spin} radius={WHEEL_RADIUS} />}

      {cmp.slow.visible && (
        <Wheel position={cmp.slow.position} dir={cmp.slow.dir} spinAngle={cmp.slow.spinAngle} radius={cmp.slow.radius} />
      )}
      {cmp.fast.visible && (
        <Wheel
          position={cmp.fast.position}
          dir={cmp.fast.dir}
          spinAngle={cmp.fast.spinAngle}
          radius={cmp.fast.radius}
          color="#fff2d2"
        />
      )}

      {/* Ghost wheels: translucent "naive expectation" copies, never the real object. */}
      {ghosts.map((g) => (
        <Wheel key={g.key} dir={g.dir} spinAngle={0} radius={WHEEL_RADIUS} ghost opacity={g.opacity} color="#93a6c4" />
      ))}

      {/* The one arrow: a glowing angular-velocity arc hugging the rim. */}
      {spinArcVisible(frame) && heroVisible && (
        <SpinArc axleDir={dir} spinAngle={spin} radius={WHEEL_RADIUS} />
      )}
    </>
  );
};
