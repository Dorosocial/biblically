import React from 'react';
import {SceneState} from '../physics';
import {CameraRig} from '../camera/CameraRig';
import {Lighting} from './Lighting';
import {NestedUniverse} from '../../shared/NestedUniverse';
import {BlackHole} from '../../blackhole/scene/BlackHole';
import {Earth} from '../../shared/Earth';
import {Starfield} from '../../shared/Starfield';

export const Scene: React.FC<{frame: number; s: SceneState}> = ({frame, s}) => {
  return (
    <>
      <Lighting fillIntensity={s.fillIntensity} />
      <CameraRig frame={frame} />

      {s.starfieldOpacity > 0.001 && (
        <Starfield count={900} size={4} radius={110} opacity={s.starfieldOpacity} />
      )}

      {s.universe && s.universe.visible && (
        <NestedUniverse
          position={s.universe.position}
          scale={s.universe.scale}
          opacity={s.universe.opacity}
          revealLevel={s.universe.revealLevel}
        />
      )}

      {s.universeAsBlackHole && s.universeAsBlackHole.visible && (
        <BlackHole
          position={s.universeAsBlackHole.position}
          scale={s.universeAsBlackHole.scale}
          opacity={s.universeAsBlackHole.opacity}
          diskOpacity={0}
          haloOpacity={0.85}
        />
      )}

      {s.earth.visible && <Earth state={s.earth} />}
    </>
  );
};
