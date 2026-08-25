import React from 'react';
import {SceneState} from '../physics';
import {CameraRig} from '../camera/CameraRig';
import {Lighting} from './Lighting';
import {NestedUniverse} from '../../shared/NestedUniverse';
import {BlackHole} from '../../shared/BlackHole';
import {SpacetimeGrid} from '../../shared/SpacetimeGrid';
import {Earth} from '../../shared/Earth';
import {Starfield} from '../../shared/Starfield';
import {Spacecraft} from '../../shared/Spacecraft';
import {Silhouette} from '../../shared/Silhouette';
import {Paper2D, Creature2D} from '../../shared/Paper2D';
import {Telescope} from '../../shared/Telescope';
import {CMBMap} from '../../shared/CMBMap';
import {LightCone} from '../../shared/LightCone';
import {Book} from '../../shared/Book';
import {CosmicTree} from '../../shared/CosmicTree';
import {Hand} from '../../shared/Hand';
import {Sun} from '../../blackhole/scene/Sun';
import {InfallParticles} from './InfallParticles';
import {HawkingParticles} from './HawkingParticles';
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
      {s.hawking && <HawkingParticles progress={s.hawking.progress} opacity={s.hawking.opacity} />}

      {s.lightBeam && <LightBeam progress={s.lightBeam.progress} opacity={s.lightBeam.opacity} />}
      {s.trajectories &&
        s.trajectories.seeds.map((seed) => (
          <LightBeam key={seed} seed={seed} progress={s.trajectories!.progress} opacity={s.trajectories!.opacity} />
        ))}

      {s.earth.visible && <Earth state={s.earth} />}
      {s.spacecraft.visible && <Spacecraft state={s.spacecraft} />}

      {s.sun && s.sun.visible && <Sun position={s.sun.position} scale={s.sun.scale} opacity={s.sun.opacity} />}

      {s.silhouette.visible && (
        <Silhouette
          position={s.silhouette.position}
          rotation={s.silhouette.rotation}
          scale={s.silhouette.scale}
          opacity={s.silhouette.opacity}
          lookUp={s.silhouette.lookUp}
        />
      )}
      {s.paper && s.paper.visible && (
        <Paper2D position={s.paper.position} rotation={s.paper.rotation} size={s.paper.size} opacity={s.paper.opacity} />
      )}
      {s.creature && s.creature.visible && (
        <Creature2D position={s.creature.position} heading={s.creature.heading} opacity={s.creature.opacity} />
      )}
      {s.hand && s.hand.visible && (
        <Hand position={s.hand.position} rotation={s.hand.rotation} scale={s.hand.scale} opacity={s.hand.opacity} />
      )}

      {s.telescope && s.telescope.visible && (
        <Telescope
          position={s.telescope.position}
          rotation={s.telescope.rotation}
          scale={s.telescope.scale}
          opacity={s.telescope.opacity}
        />
      )}

      {s.cmb && s.cmb.visible && (
        <CMBMap position={s.cmb.position} rotation={s.cmb.rotation} scale={s.cmb.scale} opacity={s.cmb.opacity} />
      )}

      {s.lightCone && s.lightCone.visible && (
        <LightCone
          position={s.lightCone.position}
          rotation={s.lightCone.rotation}
          scale={s.lightCone.scale}
          opacity={s.lightCone.opacity}
        />
      )}

      {s.book && s.book.visible && (
        <Book
          position={s.book.position}
          rotation={s.book.rotation}
          scale={s.book.scale}
          opacity={s.book.opacity}
          dissolveProgress={s.book.dissolveProgress}
        />
      )}

      {s.cosmicTree && s.cosmicTree.visible && (
        <CosmicTree
          position={s.cosmicTree.position}
          rotation={s.cosmicTree.rotation}
          scale={s.cosmicTree.scale}
          opacity={s.cosmicTree.opacity}
          growth={s.cosmicTree.growth}
        />
      )}
    </>
  );
};
