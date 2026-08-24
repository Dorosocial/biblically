import React from 'react';
import {Composition} from 'remotion';
import {GyroscopicPrecession} from './GyroscopicPrecession';
import {DURATION_IN_FRAMES, FPS, WIDTH, HEIGHT} from './timing';
import {HowSmallIsAProton} from './proton/HowSmallIsAProton';
import {
  DURATION_IN_FRAMES as PROTON_DURATION_IN_FRAMES,
  FPS as PROTON_FPS,
  WIDTH as PROTON_WIDTH,
  HEIGHT as PROTON_HEIGHT,
} from './proton/timing';
import {WhatIsRealityActuallyMadeOf} from './reality/WhatIsRealityActuallyMadeOf';
import {
  DURATION_IN_FRAMES as REALITY_DURATION_IN_FRAMES,
  FPS as REALITY_FPS,
  WIDTH as REALITY_WIDTH,
  HEIGHT as REALITY_HEIGHT,
} from './reality/timing';
import {ScientistsAreTerrifiedOfThisBlackHole} from './blackhole/ScientistsAreTerrifiedOfThisBlackHole';
import {
  DURATION_IN_FRAMES as BLACKHOLE_DURATION_IN_FRAMES,
  FPS as BLACKHOLE_FPS,
  WIDTH as BLACKHOLE_WIDTH,
  HEIGHT as BLACKHOLE_HEIGHT,
} from './blackhole/timing';
import {WhatIfOurUniverseIsInsideABlackHole} from './blackhole-universe/WhatIfOurUniverseIsInsideABlackHole';
import {
  DURATION_IN_FRAMES as BHU_DURATION_IN_FRAMES,
  FPS as BHU_FPS,
  WIDTH as BHU_WIDTH,
  HEIGHT as BHU_HEIGHT,
} from './blackhole-universe/timing';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GyroscopicPrecession"
        component={GyroscopicPrecession}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="HowSmallIsAProton"
        component={HowSmallIsAProton}
        durationInFrames={PROTON_DURATION_IN_FRAMES}
        fps={PROTON_FPS}
        width={PROTON_WIDTH}
        height={PROTON_HEIGHT}
      />
      <Composition
        id="WhatIsRealityActuallyMadeOf"
        component={WhatIsRealityActuallyMadeOf}
        durationInFrames={REALITY_DURATION_IN_FRAMES}
        fps={REALITY_FPS}
        width={REALITY_WIDTH}
        height={REALITY_HEIGHT}
      />
      <Composition
        id="ScientistsAreTerrifiedOfThisBlackHole"
        component={ScientistsAreTerrifiedOfThisBlackHole}
        durationInFrames={BLACKHOLE_DURATION_IN_FRAMES}
        fps={BLACKHOLE_FPS}
        width={BLACKHOLE_WIDTH}
        height={BLACKHOLE_HEIGHT}
      />
      <Composition
        id="WhatIfOurUniverseIsInsideABlackHole"
        component={WhatIfOurUniverseIsInsideABlackHole}
        durationInFrames={BHU_DURATION_IN_FRAMES}
        fps={BHU_FPS}
        width={BHU_WIDTH}
        height={BHU_HEIGHT}
      />
    </>
  );
};
