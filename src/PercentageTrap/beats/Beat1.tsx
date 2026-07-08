import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {Shirt} from '../Shirt';
import {PriceTag} from '../PriceTag';
import {Stamp} from '../Stamp';
import {Caption} from '../Caption';
import {BEATS} from '../constants';

const STAMP1_START = 70;
const STAMP2_START = 150;

// Beat 1 (0-270, 0:00-0:09): the $100 tag pops in, then two "50% OFF"
// stamps slam down in sequence with a springy bounce.
export const Beat1: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat1.duration;

  const tagScale = spring({frame, fps, config: {damping: 12, mass: 0.6, stiffness: 140}});
  const tagOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const stamp1Frame = Math.max(0, frame - STAMP1_START);
  const stamp1Scale = spring({frame: stamp1Frame, fps, config: {damping: 8, mass: 0.7, stiffness: 130}});
  const stamp2Frame = Math.max(0, frame - STAMP2_START);
  const stamp2Scale = spring({frame: stamp2Frame, fps, config: {damping: 8, mass: 0.7, stiffness: 130}});

  return (
    <>
      <Scene>
        <Shirt x={540} y={560} scale={tagScale} opacity={tagOpacity * 0.6} />
        <PriceTag amount="100" x={540} y={500} scale={tagScale} opacity={tagOpacity} />
        {frame >= STAMP1_START ? (
          <Stamp x={390} y={660} rotation={-18} scale={stamp1Scale} lines={['50%', 'OFF']} />
        ) : null}
        {frame >= STAMP2_START ? (
          <Stamp x={690} y={790} rotation={13} scale={stamp2Scale} lines={['50%', 'OFF']} />
        ) : null}
      </Scene>
      <Caption
        frame={frame}
        duration={duration}
        text="A shirt is $100 and is 50% off, then there's an extra 50% off on top of that."
      />
    </>
  );
};
