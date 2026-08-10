import React from 'react';
import {getSceneState} from '../physics';
import {Basketball} from './Basketball';
import {Earth} from './Earth';
import {Hair} from './Hair';
import {Proton} from './Proton';
import {Cluster} from './Cluster';
import {Atom} from './Atom';
import {AtomLattice} from './AtomLattice';
import {Silhouette} from './Silhouette';
import {ChargeViz} from './ChargeViz';
import {TunnelZoom} from './TunnelZoom';
import {Lighting} from './Lighting';
import {CameraRig} from '../camera/CameraRig';

export const Scene: React.FC<{frame: number}> = ({frame}) => {
  const s = getSceneState(frame);

  return (
    <>
      <Lighting focus={s.focusPoint} focusColor={s.focusColor} focusIntensity={s.focusIntensity} fillIntensity={s.fillIntensity} />
      <CameraRig frame={frame} />

      <Basketball state={s.basketball} />
      <Earth state={s.earth} />
      <Hair state={s.hair} />
      <Proton state={s.proton} color={s.protonColor} />
      <TunnelZoom visible={s.tunnel.visible} opacity={s.tunnel.opacity} />

      {s.atomLattice && (
        <AtomLattice
          state={s.atomLattice}
          gridSize={s.atomLattice.gridSize}
          spacing={s.atomLattice.spacing}
          solidity={s.atomLattice.solidity}
        />
      )}

      {s.atom && (
        <Atom
          state={s.atom}
          electronCloudOpacity={s.atom.electronCloudOpacity}
          nucleusScale={s.atom.nucleusScale}
          nucleusHighlightIndex={s.atom.nucleusHighlightIndex}
        />
      )}

      {s.nucleusCluster && (
        <Cluster
          state={s.nucleusCluster}
          count={s.nucleusCluster.count}
          memberRadius={s.nucleusCluster.memberRadius}
          highlightIndex={s.nucleusCluster.highlightIndex}
          seed={11}
        />
      )}

      {s.chargeViz && <ChargeViz state={s.chargeViz} frame={frame} />}

      {s.silhouette && <Silhouette state={s.silhouette} kind={s.silhouette.kind} />}
    </>
  );
};
