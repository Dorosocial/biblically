import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS} from './colors';
import {WIDTH, HEIGHT} from './constants';

const BASELINE_Y = 1330;
const BAR_WIDTH = 230;
const BEFORE_X = WIDTH / 2 - 260;
const AFTER_X = WIDTH / 2 + 30;
const BEFORE_MAX_H = 210;
const AFTER_MAX_H = 480;

export const BarGraph: React.FC<{
  beforeGrow: number; // 0-1
  afterGrow: number; // 0-1
  cityLabelOpacity?: {seoul: number; stuttgart: number};
}> = ({beforeGrow, afterGrow, cityLabelOpacity}) => {
  const beforeH = BEFORE_MAX_H * beforeGrow;
  const afterH = AFTER_MAX_H * afterGrow;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH}
        height={HEIGHT}
        style={{position: 'absolute', top: 0, left: 0}}
      >
        <text
          x={WIDTH / 2}
          y={760}
          fill={COLORS.textDim}
          fontSize={30}
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight={700}
          letterSpacing={4}
          textAnchor="middle"
        >
          AVERAGE COMMUTE TIME
        </text>

        <line
          x1={140}
          y1={BASELINE_Y}
          x2={WIDTH - 140}
          y2={BASELINE_Y}
          stroke={COLORS.panelLine}
          strokeWidth={3}
        />

        {/* BEFORE bar */}
        <rect
          x={BEFORE_X}
          y={BASELINE_Y - beforeH}
          width={BAR_WIDTH}
          height={beforeH}
          fill={COLORS.amber}
          rx={10}
        />
        <text
          x={BEFORE_X + BAR_WIDTH / 2}
          y={BASELINE_Y + 60}
          fill={COLORS.text}
          fontSize={34}
          fontWeight={700}
          fontFamily="Helvetica, Arial, sans-serif"
          textAnchor="middle"
        >
          BEFORE
        </text>
        {beforeGrow > 0.85 ? (
          <text
            x={BEFORE_X + BAR_WIDTH / 2}
            y={BASELINE_Y - beforeH - 26}
            fill={COLORS.amber}
            fontSize={38}
            fontWeight={700}
            fontFamily="Helvetica, Arial, sans-serif"
            textAnchor="middle"
          >
            14 MIN
          </text>
        ) : null}

        {/* AFTER bar */}
        <rect
          x={AFTER_X}
          y={BASELINE_Y - afterH}
          width={BAR_WIDTH}
          height={afterH}
          fill={COLORS.red}
          rx={10}
        />
        <text
          x={AFTER_X + BAR_WIDTH / 2}
          y={BASELINE_Y + 60}
          fill={COLORS.text}
          fontSize={34}
          fontWeight={700}
          fontFamily="Helvetica, Arial, sans-serif"
          textAnchor="middle"
        >
          AFTER
        </text>
        {afterGrow > 0.85 ? (
          <text
            x={AFTER_X + BAR_WIDTH / 2}
            y={BASELINE_Y - afterH - 26}
            fill={COLORS.red}
            fontSize={38}
            fontWeight={700}
            fontFamily="Helvetica, Arial, sans-serif"
            textAnchor="middle"
          >
            22 MIN
          </text>
        ) : null}

        {cityLabelOpacity ? (
          <g fontFamily="Helvetica, Arial, sans-serif" fontWeight={700} letterSpacing={3}>
            <text
              x={WIDTH / 2 - 24}
              y={1495}
              fill={COLORS.text}
              fontSize={32}
              textAnchor="end"
              opacity={cityLabelOpacity.seoul}
            >
              SEOUL
            </text>
            <text
              x={WIDTH / 2 + 24}
              y={1495}
              fill={COLORS.text}
              fontSize={32}
              textAnchor="start"
              opacity={cityLabelOpacity.stuttgart}
            >
              STUTTGART
            </text>
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};
