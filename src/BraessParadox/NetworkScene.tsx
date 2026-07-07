import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, CameraShot} from './Camera';
import {Road} from './Road';
import {NodeDot} from './NodeDot';
import {CarStream} from './CarStream';
import {NODE_A, NODE_B, NODE_M1, NODE_M2, PATH_D, RouteSampler} from './geometry';
import {COLORS, trafficColor} from './colors';
import {WIDTH, HEIGHT} from './constants';

export type StreamConfig = {
  route: RouteSampler;
  count: number;
  speed: number;
  phase?: number;
  congestion?: number;
  jam?: number;
  radius?: number;
};

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
  shortcutGlow?: boolean;
  showMidNodes?: boolean;
  streams?: StreamConfig[];
}> = ({
  frame,
  shot,
  roadWidth = 14,
  leftCongestion = 0,
  rightCongestion = 0,
  showShortcut = false,
  shortcutProgress = 1,
  shortcutCongestion = 0,
  shortcutOpacity = 1,
  shortcutGlow = false,
  showMidNodes = false,
  streams = [],
}) => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH}
        height={HEIGHT}
        style={{position: 'absolute', top: 0, left: 0}}
      >
        <defs>
          <filter id="roadGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <Camera shot={shot}>
          <Road d={PATH_D.roadLeft} color={trafficColor(leftCongestion)} width={roadWidth} />
          <Road d={PATH_D.roadRight} color={trafficColor(rightCongestion)} width={roadWidth} />
          {showShortcut ? (
            <Road
              d={PATH_D.shortcut}
              color={trafficColor(shortcutCongestion)}
              width={roadWidth}
              progress={shortcutProgress}
              opacity={shortcutOpacity}
              glow={shortcutGlow}
            />
          ) : null}

          {streams.map((s, i) => (
            <CarStream
              key={i}
              route={s.route}
              frame={frame}
              count={s.count}
              speed={s.speed}
              phase={s.phase}
              congestion={s.congestion}
              jam={s.jam}
              radius={s.radius}
            />
          ))}

          {showMidNodes ? (
            <>
              <NodeDot pt={NODE_M1} label="M1" radius={16} fontSize={16} dim opacity={shortcutOpacity} />
              <NodeDot pt={NODE_M2} label="M2" radius={16} fontSize={16} dim opacity={shortcutOpacity} />
            </>
          ) : null}

          <NodeDot pt={NODE_A} label="A" />
          <NodeDot pt={NODE_B} label="B" />
        </Camera>
      </svg>
    </AbsoluteFill>
  );
};
