import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Scene} from '../Scene';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

const CX = 880;
const CY = 220;
const CLOCK_R = 90;

// Beat 5 (510-630, 0:17-0:21): HARD CUT to a corner timer icon, genuinely
// ticking (a real rotating hand, not idle decoration) while the rest of
// the frame stays empty — a beat for the viewer to actually pause.
export const Beat5: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat5.duration;
  const handAngle = (frame / duration) * 360 * 2;

  const ticks = Array.from({length: 12}, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const inner = CLOCK_R - 14;
    const outer = CLOCK_R - 4;
    return {
      x1: CX + inner * Math.cos(a),
      y1: CY + inner * Math.sin(a),
      x2: CX + outer * Math.cos(a),
      y2: CY + outer * Math.sin(a),
    };
  });

  return (
    <>
      <Scene>
        <circle cx={CX} cy={CY} r={CLOCK_R} fill="none" stroke={COLORS.bone} strokeWidth={5} />
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={COLORS.boneDim} strokeWidth={4} />
        ))}
        <g transform={`translate(${CX} ${CY}) rotate(${handAngle})`}>
          <line x1={0} y1={0} x2={0} y2={-CLOCK_R + 22} stroke={COLORS.bone} strokeWidth={6} strokeLinecap="round" />
        </g>
        <rect x={CX - 20} y={CY - 22} width={12} height={44} rx={3} fill={COLORS.green} />
        <rect x={CX + 8} y={CY - 22} width={12} height={44} rx={3} fill={COLORS.green} />
      </Scene>
      <Caption frame={frame} duration={duration} text="I want you to pause and actually work it out." />
    </>
  );
};
