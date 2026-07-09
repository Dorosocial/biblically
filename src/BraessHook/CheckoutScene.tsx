import React from 'react';
import {COLORS, trafficColor} from './colors';

export const LANE_X = [220, 420, 620, 820];
export const LANE_TOP = 620;
export const LANE_BOTTOM = 1280;
const LANE_WIDTH = 130;

export type LaneState = {queueCount: number; congestion: number};
export type MovingShopper = {x: number; y: number; color?: string};

// A simple checkout-lane illustration: N vertical lane channels, each
// with a register cap and a stack of "shopper" dots. One lane is the
// express lane, called out with a floating sign. `movingShoppers` are
// rendered as free-floating dots mid-transit, independent of the settled
// per-lane queue stacks — this is what lets a beat animate shoppers
// physically rushing toward the express lane frame by frame.
export const CheckoutScene: React.FC<{
  lanes: LaneState[];
  expressLaneIndex: number;
  signOpacity?: number;
  signColor?: string;
  movingShoppers?: MovingShopper[];
}> = ({lanes, expressLaneIndex, signOpacity = 1, signColor = COLORS.green, movingShoppers = []}) => {
  return (
    <g fontFamily="Helvetica, Arial, sans-serif">
      {LANE_X.map((x, i) => {
        const lane = lanes[i] ?? {queueCount: 0, congestion: 0};
        const color = trafficColor(lane.congestion);
        const shopperSpacing = 76;
        const shoppers = Array.from({length: lane.queueCount}, (_, s) => (
          <circle key={s} cx={x} cy={LANE_BOTTOM - 60 - s * shopperSpacing} r={26} fill={color} opacity={0.92} />
        ));

        return (
          <g key={i}>
            <rect
              x={x - LANE_WIDTH / 2}
              y={LANE_TOP}
              width={LANE_WIDTH}
              height={LANE_BOTTOM - LANE_TOP}
              rx={16}
              fill="none"
              stroke={i === expressLaneIndex ? color : COLORS.boneDim}
              strokeWidth={5}
            />
            <rect x={x - 44} y={LANE_TOP - 46} width={88} height={46} rx={8} fill="none" stroke={COLORS.bone} strokeWidth={5} />
            {shoppers}
            {i === expressLaneIndex ? (
              <g opacity={signOpacity}>
                <rect x={x - 118} y={LANE_TOP - 150} width={236} height={78} rx={12} fill="none" stroke={signColor} strokeWidth={5} />
                <text x={x} y={LANE_TOP - 111} fill={signColor} fontSize={26} fontWeight={800} textAnchor="middle" dominantBaseline="central">
                  EXPRESS
                </text>
                <text x={x} y={LANE_TOP - 84} fill={signColor} fontSize={22} fontWeight={800} textAnchor="middle" dominantBaseline="central">
                  LANE
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
      {movingShoppers.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={24} fill={s.color ?? COLORS.green} opacity={0.9} />
      ))}
    </g>
  );
};
