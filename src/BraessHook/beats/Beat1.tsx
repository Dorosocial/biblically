import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {NodeDot} from '../NodeDot';
import {PhraseCaption} from '../PhraseCaption';
import {BEATS} from '../constants';
import {NODE_A, NODE_B, ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';
import {easeInOutCubic} from '../ease';

const PUSH_END = 30;
const PAN_END = 110;

const PHRASES = [
  {at: 0, words: [{text: 'A'}, {text: 'CITY'}, {text: 'HAS'}]},
  {at: 34, words: [{text: 'TWO'}, {text: 'ROADS', accent: true}]},
  {at: 66, words: [{text: 'CONNECTING'}, {text: 'A'}, {text: 'TO'}, {text: 'B'}]},
  {at: 108, words: [{text: 'TRAFFIC'}, {text: 'IS'}, {text: 'HEAVY'}]},
  {at: 146, words: [{text: 'BUT'}, {text: 'PREDICTABLE'}]},
];

// Beat 1 (0-180, 0:00-0:06): ONE continuous camera move — push in on node
// A, whip-pan tracing road_left to node B, then pull back to reveal both
// roads. No stacked separate snaps, just one flowing motion.
export const Beat1: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat1.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const panT = easeInOutCubic(interpolate(frame, [PUSH_END, PAN_END], [0, 1], clampOpts));
  const pullbackT = easeInOutCubic(interpolate(frame, [PAN_END, duration], [0, 1], clampOpts));

  let shot = {cx: NODE_A.x, cy: NODE_A.y, scale: 2.0};
  if (frame <= PUSH_END) {
    shot = {cx: NODE_A.x, cy: NODE_A.y, scale: interpolate(frame, [0, PUSH_END], [2.0, 3.2], clampOpts)};
  } else if (frame <= PAN_END) {
    const pt = ROUTE_LEFT(panT);
    const scale = interpolate(panT, [0, 0.15, 0.85, 1], [3.2, 2.4, 2.4, 3.4]);
    shot = {cx: pt.x, cy: pt.y, scale};
  } else {
    const wide = {cx: 540, cy: 910, scale: 1.05};
    shot = {
      cx: NODE_B.x + (wide.cx - NODE_B.x) * pullbackT,
      cy: NODE_B.y + (wide.cy - NODE_B.y) * pullbackT,
      scale: 3.4 + (wide.scale - 3.4) * pullbackT,
    };
  }

  const aOpacity = interpolate(frame, [0, 6], [0, 1], clampOpts);
  const bPopScale = spring({
    frame: Math.max(0, frame - (PAN_END - 14)),
    fps,
    config: {damping: 11, mass: 0.5, stiffness: 220},
  });

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showNodesAB={false}
        streams={[
          {route: ROUTE_LEFT, count: 9, speed: 0.006},
          {route: ROUTE_RIGHT, count: 9, speed: 0.006, phase: 0.5},
        ]}
      >
        <NodeDot pt={NODE_A} label="A" opacity={aOpacity} />
        <g transform={`translate(${NODE_B.x} ${NODE_B.y}) scale(${bPopScale}) translate(${-NODE_B.x} ${-NODE_B.y})`}>
          <NodeDot pt={NODE_B} label="B" />
        </g>
      </NetworkScene>
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
