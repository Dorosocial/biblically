import React from 'react';
import {useCurrentFrame} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {NODE_M1, NODE_M2} from '../geometry';

const SHOT = {cx: (NODE_M1.x + NODE_M2.x) / 2, cy: (NODE_M1.y + NODE_M2.y) / 2, scale: 2.1};

// Beat 8 (1140-1200, 0:38-0:40): a brief connector beat — the camera
// settles on the shortcut area for a short anticipation hold before the
// congestion narrative continues. No new camera move, no caption text.
export const Beat8: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <NetworkScene
      frame={frame}
      shot={SHOT}
      showShortcut
      showMidNodes
      leftCongestion={0.1}
      rightCongestion={0.1}
      shortcutCongestion={0.1}
    />
  );
};
