import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {Camera} from '../Camera';
import {Hallway} from '../Hallway';
import {SofaShape} from '../SofaShape';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';
import {rectLocalPoints, RECT_STUCK_THETA} from '../geometry';
import {easeOutCubic, easeInOutCubic} from '../ease';

const WALL_DRAW_END = 40;
const RECT_FADE_START = 40;
const RECT_FADE_END = 60;
const SLIDE_START = 60;
const SLIDE_END = 150;
const ROTATE_START = 150;
const ROTATE_END = 260;
const SLIDE_OFFSET = 2.0;

const WIDE = {cx: 580, cy: 780, scale: 0.92};
const TIGHT = {cx: 520, cy: 680, scale: 1.35};

const PHRASES = [
  {at: 0, words: [{text: 'IMAGINE'}, {text: "YOU'RE"}, {text: 'MOVING'}]},
  {at: 35, words: [{text: 'A'}, {text: 'SOFA'}, {text: 'AROUND'}, {text: 'A'}, {text: 'CORNER'}]},
  {at: 80, words: [{text: 'WHAT'}, {text: 'IS'}, {text: 'THE'}, {text: 'BIGGEST'}, {text: 'SOFA'}]},
  {at: 125, words: [{text: 'THAT'}, {text: 'COULD'}, {text: 'POSSIBLY'}]},
  {at: 160, words: [{text: 'MAKE'}, {text: 'THE'}, {text: 'TURN'}]},
  {at: 195, words: [{text: 'IT'}, {text: 'SOUNDS'}, {text: 'LIKE'}, {text: 'A'}, {text: 'SIMPLE'}]},
  {at: 230, words: [{text: 'FURNITURE'}, {text: 'PROBLEM'}]},
  {at: 260, words: [{text: 'BUT'}, {text: 'MATHEMATICIANS...'}]},
];

// Beat 1 (0-300, 0:00-0:10): the hallway draws in, a basic rectangular
// sofa slides in from deep in the corridor, then attempts to rotate
// through the corner and visibly jams. One continuous camera move: hold
// wide, then a single push toward the corner as it jams.
export const Beat1: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = 300;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const wallProgress = interpolate(frame, [0, WALL_DRAW_END], [0, 1], clampOpts);
  const rectOpacity = interpolate(frame, [RECT_FADE_START, RECT_FADE_END], [0, 1], clampOpts);

  const slideT = easeInOutCubic(interpolate(frame, [SLIDE_START, SLIDE_END], [0, 1], clampOpts));
  const slideOffset = SLIDE_OFFSET * (1 - slideT);

  const rotateT = easeOutCubic(interpolate(frame, [ROTATE_START, ROTATE_END], [0, 1], clampOpts));
  const theta = RECT_STUCK_THETA * rotateT;

  const pushT = easeInOutCubic(interpolate(frame, [ROTATE_START, ROTATE_END], [0, 1], clampOpts));
  const shot = {
    cx: WIDE.cx + (TIGHT.cx - WIDE.cx) * pushT,
    cy: WIDE.cy + (TIGHT.cy - WIDE.cy) * pushT,
    scale: WIDE.scale + (TIGHT.scale - WIDE.scale) * pushT,
  };

  const rectPoints = rectLocalPoints().map((p) => ({x: p.x + slideOffset, y: p.y}));

  return (
    <>
      <Scene>
        <Camera shot={shot}>
          <Hallway progress={wallProgress} />
          {rectOpacity > 0.01 ? (
            <SofaShape localPoints={rectPoints} theta={theta} color={COLORS.bone} opacity={rectOpacity} fillOpacity={0.1} />
          ) : null}
        </Camera>
      </Scene>
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
