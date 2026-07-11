import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {Camera} from '../Camera';
import {Hallway} from '../Hallway';
import {SofaShape} from '../SofaShape';
import {COLORS} from '../colors';
import {buildSofaLocalPoints, SOFA_SHAPES} from '../geometry';
import {easeInOutCubic} from '../ease';

const WIDE = {cx: 580, cy: 780, scale: 0.92};
// Contiguous slots (no gaps) so there's never a frame between shapes with
// nothing on screen.
const SLOTS = [
  {start: 0, end: 23},
  {start: 23, end: 46},
  {start: 46, end: 68},
  {start: 68, end: 90},
];

// Beat 3 (390-480, 0:13-0:16): SILENT — no VO. A rapid montage: four
// sofa shapes, each escalating in size and curvature, genuinely rotate
// through the corner in real time and land safely in the vertical
// corridor. The camera holds one wide, steady framing throughout; the
// shapes themselves are the motion.
export const Beat3: React.FC = () => {
  const frame = useCurrentFrame();
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  let activeSlot = SLOTS.length - 1;
  for (let i = 0; i < SLOTS.length; i++) {
    if (frame < SLOTS[i].end) {
      activeSlot = i;
      break;
    }
  }
  const slot = SLOTS[activeSlot];
  const localFrame = frame - slot.start;
  const slotDuration = slot.end - slot.start;

  const opacity = interpolate(localFrame, [0, 4], [0, 1], clampOpts);
  const rotateT = easeInOutCubic(interpolate(localFrame, [4, slotDuration], [0, 1], clampOpts));
  const theta = -(Math.PI / 2) * rotateT;

  const points = buildSofaLocalPoints(SOFA_SHAPES[activeSlot]);

  return (
    <Scene>
      <Camera shot={WIDE}>
        <Hallway />
        <SofaShape localPoints={points} theta={theta} color={COLORS.green} opacity={opacity} fillOpacity={0.16} />
      </Camera>
    </Scene>
  );
};
