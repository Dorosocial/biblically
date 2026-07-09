import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {DecisionArrow} from '../DecisionArrow';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST} from '../geometry';

const HOLD = 9; // ~0.3s per driver at 30fps
const TARGETS = [
  {t: 0.15, route: ROUTE_MIX_VIA_M1_FIRST, rotation: -20},
  {t: 0.15, route: ROUTE_MIX_VIA_M2_FIRST, rotation: 20},
  {t: 0.4, route: ROUTE_MIX_VIA_M1_FIRST, rotation: -8},
  {t: 0.4, route: ROUTE_MIX_VIA_M2_FIRST, rotation: 8},
];
const SNAP_END = TARGETS.length * HOLD;

// Beat 17 (1110-1230, 40s-44s): the camera punches in on several
// individual drivers in rapid succession, each showing the same
// decision-arrow, then pulls back to reveal the pattern.
export const Beat17: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat17.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const activeIndex = Math.min(TARGETS.length - 1, Math.floor(frame / HOLD));
  const target = TARGETS[activeIndex];
  const targetPt = target.route(target.t);

  const pullback = interpolate(frame, [SNAP_END, SNAP_END + 30], [0, 1], clampOpts);
  const shot =
    frame < SNAP_END
      ? {cx: targetPt.x, cy: targetPt.y, scale: 2.7}
      : {
          cx: targetPt.x * (1 - pullback) + 540 * pullback,
          cy: targetPt.y * (1 - pullback) + 910 * pullback,
          scale: 2.7 - 1.7 * pullback,
        };

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut
        showMidNodes
        streams={[
          {route: ROUTE_MIX_VIA_M1_FIRST, count: 6, speed: 0.011, phase: 0.15, radius: 9},
          {route: ROUTE_MIX_VIA_M2_FIRST, count: 6, speed: 0.011, phase: 0.6, radius: 9},
        ]}
      >
        {frame < SNAP_END ? (
          <DecisionArrow x={targetPt.x} y={targetPt.y} rotationDeg={target.rotation} scale={1.6} />
        ) : (
          TARGETS.map((tg, i) => {
            const p = tg.route(tg.t);
            return <DecisionArrow key={i} x={p.x} y={p.y} rotationDeg={tg.rotation} scale={1.1} opacity={0.9} />;
          })
        )}
      </NetworkScene>
      <Caption
        frame={frame}
        duration={duration}
        text="The problem is that everyone is making the same logical choice."
      />
    </>
  );
};
