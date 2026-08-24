import React from 'react';
import {SceneState} from '../physics';
import {CameraRig} from '../camera/CameraRig';
import {Lighting} from './Lighting';
import {NestedUniverse} from '../../shared/NestedUniverse';
import {BlackHole} from '../../blackhole/scene/BlackHole';
import {SpacetimeGrid} from '../../shared/SpacetimeGrid';
import {Earth} from '../../shared/Earth';
import {Starfield} from '../../shared/Starfield';
import {InfallParticles} from './InfallParticles';
import {LightBeam} from './LightBeam';

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

      {s.blackHole && s.blackHole.visible && (
        <BlackHole
          position={s.blackHole.position}
          rotation={s.blackHole.rotation}
          scale={s.blackHole.scale}
          opacity={s.blackHole.opacity}
          diskOpacity={s.blackHole.diskOpacity}
          haloOpacity={s.blackHole.haloOpacity}
        />
      )}

      {s.grid && s.grid.visible && (
        <SpacetimeGrid
          position={s.grid.position}
          rotation={s.grid.rotation}
          opacity={s.grid.opacity}
          warpStrength={s.grid.warpStrength}
          wellPosition={s.grid.wellPosition}
          wellRadius={s.grid.wellRadius}
          wellDepth={s.grid.wellDepth}
        />
      )}

      {s.infall && <InfallParticles progress={s.infall.progress} opacity={s.infall.opacity} />}

      {s.lightBeam && <LightBeam progress={s.lightBeam.progress} opacity={s.lightBeam.opacity} />}

      {s.earth.visible && <Earth state={s.earth} />}
    </>
  );
};
