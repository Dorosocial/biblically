import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {BigText} from '../BigText';
import {Flash} from '../Flash';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST} from '../geometry';
import {shakeOffset, flashOpacityAt} from '../shake';

const TEXT_IMPACT = 34;

// Beat 16 (1020-1110, 37s-40s): camera pulls back to reveal all three
// roads, "NOT A ROAD PROBLEM" slams in on top.
export const Beat16: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat16.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const pullback = interpolate(frame, [0, 22], [0, 1], clampOpts);
  const drift = frame > 22 ? Math.sin((frame - 22) / 26) * 0.04 : 0;
  const scale = (1.9 - 0.9 * pullback) * (1 + drift);
  const shot = {cx: 540, cy: 910, scale};

  const textOpacity = interpolate(frame, [TEXT_IMPACT, TEXT_IMPACT + 8], [0, 1], clampOpts);
  const shake = shakeOffset(frame, TEXT_IMPACT, 16, 12);
  const flash = flashOpacityAt(frame, TEXT_IMPACT, 0.45, 6);

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut
        showMidNodes
        leftCongestion={0.15}
        rightCongestion={0.15}
        shortcutCongestion={0.15}
        streams={[
          {route: ROUTE_MIX_VIA_M1_FIRST, count: 9, speed: 0.011, phase: 0.15, radius: 9, congestion: 0.15},
          {route: ROUTE_MIX_VIA_M2_FIRST, count: 9, speed: 0.011, phase: 0.6, radius: 9, congestion: 0.15},
        ]}
      />
      <BigText shake={shake} lines={[{text: 'NOT A ROAD PROBLEM', opacity: textOpacity, color: COLORS.bone, fontSize: 62}]} top={420} />
      <Flash opacity={flash} />
      <Caption frame={frame} duration={duration} text="The problem isn't that there isn't enough roads." />
    </>
  );
};
