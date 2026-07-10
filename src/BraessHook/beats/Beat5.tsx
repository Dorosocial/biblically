import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {TrackedDot} from '../CarStream';
import {RippleEffect} from '../RippleEffect';
import {Flash} from '../Flash';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';
import {
  ROUTE_LEFT,
  ROUTE_RIGHT,
  ROUTE_MIX_VIA_M1_FIRST,
  SHORTCUT,
  NODE_M1,
  NODE_M2,
  segmentPoint,
} from '../geometry';
import {shakeOffset, flashOpacityAt} from '../shake';
import {easeInOutCubic} from '../ease';

const CONNECT_FRAME = 60; // global frame 660 — the ONE shake/flash moment
const FOLLOW_END = 120;
const RIPPLE_CENTER = {cx: (NODE_M1.x + NODE_M2.x) / 2, cy: (NODE_M1.y + NODE_M2.y) / 2};
const TAG_START = 90;

// Beat 5 (600-780, 0:20-0:26): the shortcut finishes connecting at global
// frame 660 — the ONE screen-shake/impact-flash moment in the whole
// video. Then the camera follows one car dot onto the shortcut (TIME
// SAVED tag), then holds calmly tracking a ripple spreading outward.
export const Beat5: React.FC = () => {
  const frame = useCurrentFrame();
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const drawProgress = interpolate(frame, [0, CONNECT_FRAME], [0.55, 1], clampOpts);
  const shake = shakeOffset(frame, CONNECT_FRAME, 16, 12);
  const flash = flashOpacityAt(frame, CONNECT_FRAME, 0.55, 8);

  const trackedT = easeInOutCubic(interpolate(frame, [CONNECT_FRAME, FOLLOW_END], [0.15, 0.62], clampOpts));
  const dotPos = ROUTE_MIX_VIA_M1_FIRST(trackedT);
  const tagOpacity = interpolate(frame, [TAG_START, TAG_START + 12], [0, 1], clampOpts);

  let shot = {cx: 0, cy: 0, scale: 2.4};
  if (frame < CONNECT_FRAME) {
    const leadPt = segmentPoint(SHORTCUT, drawProgress);
    shot = {cx: leadPt.x + shake.x, cy: leadPt.y + shake.y, scale: 2.5};
  } else if (frame < FOLLOW_END) {
    shot = {cx: dotPos.x, cy: dotPos.y, scale: 2.3};
  } else {
    shot = {cx: RIPPLE_CENTER.cx, cy: RIPPLE_CENTER.cy, scale: 2.0};
  }

  const PHRASES = [
    {at: 0, words: [{text: 'A'}, {text: 'FEW'}, {text: 'DRIVERS'}]},
    {at: 40, words: [{text: 'DISCOVER'}, {text: 'THE'}, {text: 'SHORTCUT', accent: true}]},
    {at: 82, words: [{text: 'AND'}, {text: 'SAVE'}, {text: 'TIME', accent: true}]},
    {at: 122, words: [{text: 'BUT'}, {text: 'THEN...'}]},
    {at: 152, words: [{text: 'EVERYONE'}, {text: 'NOTICES'}]},
  ];

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut
        shortcutProgress={frame < CONNECT_FRAME ? drawProgress : 1}
        showMidNodes
        streams={[
          {route: ROUTE_LEFT, count: 8, speed: 0.006},
          {route: ROUTE_RIGHT, count: 8, speed: 0.006, phase: 0.5},
        ]}
      >
        {frame >= CONNECT_FRAME && frame < FOLLOW_END ? (
          <>
            <TrackedDot route={ROUTE_MIX_VIA_M1_FIRST} t={trackedT} radius={13} />
            <g opacity={tagOpacity} transform={`translate(${dotPos.x} ${dotPos.y - 70})`}>
              <rect x={-96} y={-34} width={192} height={56} rx={12} fill="none" stroke={COLORS.green} strokeWidth={4} />
              <text x={0} y={0} fill={COLORS.green} fontSize={26} fontWeight={800} textAnchor="middle" dominantBaseline="central">
                TIME SAVED
              </text>
            </g>
          </>
        ) : null}
        {frame >= FOLLOW_END ? <RippleEffect cx={RIPPLE_CENTER.cx} cy={RIPPLE_CENTER.cy} frame={frame - FOLLOW_END} /> : null}
      </NetworkScene>
      <Flash opacity={flash} />
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
