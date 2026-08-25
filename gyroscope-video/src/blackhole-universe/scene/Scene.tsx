import React from 'react';
import {SceneState} from '../physics';
import {CameraRig} from '../camera/CameraRig';
import {Lighting} from './Lighting';
import {NestedUniverse} from '../../shared/NestedUniverse';
import {BlackHole} from '../../shared/BlackHole';
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
          lensingOpacity={0.85}
        />
      )}

      {s.blackHole && s.blackHole.visible && (
        <BlackHole
          position={s.blackHole.position}
          rotation={s.blackHole.rotation}
          scale={s.blackHole.scale}
          opacity={s.blackHole.opacity}
          diskOpacity={s.blackHole.diskOpacity}
          lensingOpacity={s.blackHole.lensingOpacity}
        />
      )}

      {s.grid && s.grid.visible && (
        // BUG FOUND + FIXED: the shared component's default color (#3d6fbf,
        // a muted mid-blue at lineWidth 1) rendered as faint grey lines —
        // confirmed via a direct still-frame check, and a direct violation
        // of the visual spec's "distinct, high-contrast color (not faint
        // gray lines)". Overriding with a bright cyan + thicker lineWidth
        // here rather than changing the shared default, so the other video
        // using this component isn't affected.
        <SpacetimeGrid
          position={s.grid.position}
          rotation={s.grid.rotation}
          opacity={s.grid.opacity}
          warpStrength={s.grid.warpStrength}
          wellPosition={s.grid.wellPosition}
          wellRadius={s.grid.wellRadius}
          wellDepth={s.grid.wellDepth}
          color="#5be3ff"
          lineWidth={2.5}
        />
      )}

      {s.infall && <InfallParticles progress={s.infall.progress} opacity={s.infall.opacity} />}

      {s.lightBeam && <LightBeam progress={s.lightBeam.progress} opacity={s.lightBeam.opacity} />}

      {s.earth.visible && <Earth state={s.earth} />}
    </>
  );
};
