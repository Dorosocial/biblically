import React from 'react';
import {SceneState} from '../physics';
import {getCameraState} from '../camera/cameraTimeline';
import {CameraRig} from '../camera/CameraRig';
import {Lighting} from './Lighting';
import {BlackHole} from './BlackHole';
import {Sun} from './Sun';
import {Starfield} from '../../shared/Starfield';
import {SpacetimeGrid} from '../../shared/SpacetimeGrid';
import {Spacecraft} from '../../shared/Spacecraft';
import {Earth} from '../../shared/Earth';

export const Scene: React.FC<{frame: number; s: SceneState}> = ({frame, s}) => {
  const cam = getCameraState(frame);
  const cameraPosition: [number, number, number] = [cam.position.x, cam.position.y, cam.position.z];
  const blackHoleCenter: [number, number, number] = s.blackHole ? s.blackHole.position : [0, 0, 0];

  return (
    <>
      <Lighting
        fillIntensity={s.fillIntensity}
        sunLightPosition={s.sunLightPosition}
        sunLightIntensity={s.sunLightIntensity}
      />
      <CameraRig frame={frame} />

      {s.starfieldOpacity > 0.001 && (
        // size is in FIXED PIXELS (sizeAttenuation off in Starfield.tsx) —
        // stars were rendering completely invisible throughout the video
        // regardless of count/world-unit size, confirmed by directly
        // computing the frustum (33 stars were geometrically in view at
        // frame 180, a still render showed literally zero of them). Fixed
        // pixel points sidestep whatever this software WebGL renderer was
        // doing wrong with per-vertex size attenuation in the point shader.
        <Starfield
          count={1000}
          size={5}
          opacity={s.starfieldOpacity}
          warpStrength={s.starfieldWarp}
          cameraPosition={cameraPosition}
          blackHoleCenter={blackHoleCenter}
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

      {s.sun && s.sun.visible && <Sun position={s.sun.position} scale={s.sun.scale} opacity={s.sun.opacity} />}

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
      {s.grid2 && s.grid2.visible && (
        <SpacetimeGrid
          position={s.grid2.position}
          rotation={s.grid2.rotation}
          opacity={s.grid2.opacity}
          warpStrength={s.grid2.warpStrength}
          wellPosition={s.grid2.wellPosition}
          wellRadius={s.grid2.wellRadius}
          wellDepth={s.grid2.wellDepth}
        />
      )}

      {s.spacecraft && <Spacecraft state={s.spacecraft} />}
      {s.earth && <Earth state={s.earth} />}
    </>
  );
};
