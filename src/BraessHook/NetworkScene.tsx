import React from 'react';
import {Scene} from './Scene';
import {Camera, CameraShot} from './Camera';
import {Road} from './Road';
import {NodeDot} from './NodeDot';
import {CarStream} from './CarStream';
import {NODE_A, NODE_B, NODE_M1, NODE_M2, PATH_D, RouteSampler} from './geometry';
import {COLORS, trafficColor} from './colors';

export type StreamConfig = {
  route: RouteSampler;
  count: number;
  speed: number;
  phase?: number;
  congestion?: number;
  jam?: number;
  radius?: number;
};

// The `shot` prop is expected to be recomputed every frame by the calling
// beat (dot-tracking, path-following, whip-pan interpolation) — that's
// what drives the retention-cut camera language, not a static lookup.
export const NetworkScene: React.FC<{
  frame: number;
  shot: CameraShot;
  roadWidth?: number;
  leftCongestion?: number;
  rightCongestion?: number;
  showShortcut?: boolean;
  shortcutProgress?: number;
  shortcutCongestion?: number;
  shortcutOpacity?: number;
  showMidNodes?: boolean;
  showNodesAB?: boolean;
  chokepointRings?: boolean;
  streams?: StreamConfig[];
  children?: React.ReactNode;
}> = ({
  frame,
  shot,
  roadWidth = 12,
  leftCongestion = 0,
  rightCongestion = 0,
  showShortcut = false,
  shortcutProgress = 1,
  shortcutCongestion = 0,
  shortcutOpacity = 1,
  showMidNodes = false,
  showNodesAB = true,
  chokepointRings = false,
  streams = [],
  children,
}) => {
  const ringPulse = 0.6 + 0.4 * Math.sin(frame / 10);

  return (
    <Scene>
      <Camera shot={shot}>
        <Road d={PATH_D.roadLeft} color={trafficColor(leftCongestion)} width={roadWidth} />
        <Road d={PATH_D.roadRight} color={trafficColor(rightCongestion)} width={roadWidth} />
        {showShortcut ? (
          <Road d={PATH_D.shortcut} color={trafficColor(shortcutCongestion)} width={roadWidth} progress={shortcutProgress} opacity={shortcutOpacity} />
        ) : null}

        {streams.map((s, i) => (
          <CarStream key={i} route={s.route} frame={frame} count={s.count} speed={s.speed} phase={s.phase} congestion={s.congestion} jam={s.jam} radius={s.radius} />
        ))}

        {chokepointRings ? (
          <>
            <circle cx={NODE_M1.x} cy={NODE_M1.y} r={46 * ringPulse} fill="none" stroke={COLORS.pink} strokeWidth={5} opacity={0.85} />
            <circle cx={NODE_M2.x} cy={NODE_M2.y} r={46 * ringPulse} fill="none" stroke={COLORS.pink} strokeWidth={5} opacity={0.85} />
          </>
        ) : null}

        {showMidNodes ? (
          <>
            <NodeDot pt={NODE_M1} label="M1" radius={18} fontSize={18} dim opacity={shortcutOpacity} />
            <NodeDot pt={NODE_M2} label="M2" radius={18} fontSize={18} dim opacity={shortcutOpacity} />
          </>
        ) : null}

        {showNodesAB ? (
          <>
            <NodeDot pt={NODE_A} label="A" />
            <NodeDot pt={NODE_B} label="B" />
          </>
        ) : null}

        {children}
      </Camera>
    </Scene>
  );
};
