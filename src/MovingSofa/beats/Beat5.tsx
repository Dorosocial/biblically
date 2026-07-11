import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {Camera} from '../Camera';
import {Hallway} from '../Hallway';
import {SofaShape} from '../SofaShape';
import {TitleBlock} from '../TitleBlock';
import {Wordmark} from '../Wordmark';
import {COLORS} from '../colors';
import {buildSofaLocalPoints, SOFA_SHAPES} from '../geometry';

const TIGHT = {cx: 500, cy: 800, scale: 1.28};
const gerverPoints = buildSofaLocalPoints(SOFA_SHAPES[3]);

// Beat 5 (600-750, 0:20-0:25): the diagram dims to a quiet backdrop as
// the title card takes over — "MOVING SOFA PROBLEM" fades in, then the
// attribution line, then the Zombie Math wordmark settles in. Holds as
// the final frame.
export const Beat5: React.FC = () => {
  const frame = useCurrentFrame();
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const diagramOpacity = interpolate(frame, [0, 40], [1, 0.22], clampOpts);
  const titleOpacity = interpolate(frame, [20, 55], [0, 1], clampOpts);
  const subOpacity = interpolate(frame, [55, 85], [0, 1], clampOpts);
  const wordmarkOpacity = interpolate(frame, [110, 160], [0, 0.85], clampOpts);

  return (
    <>
      <Scene>
        <g opacity={diagramOpacity}>
          <Camera shot={TIGHT}>
            <Hallway />
            <SofaShape localPoints={gerverPoints} theta={-Math.PI / 2} color={COLORS.green} fillOpacity={0.16} />
          </Camera>
        </g>
      </Scene>
      <TitleBlock opacity={titleOpacity} subOpacity={subOpacity} />
      <Wordmark opacity={wordmarkOpacity} />
    </>
  );
};
