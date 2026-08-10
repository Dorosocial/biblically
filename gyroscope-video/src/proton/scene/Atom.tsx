import React from 'react';
import {ObjectState} from '../types';
import {Cluster} from './Cluster';

const BASE_RADIUS = 1;

/**
 * A single enlarged atom: a soft translucent electron-cloud shell around a
 * tiny bright nucleus (a Cluster of proton/neutron spheres). The cloud's
 * own opacity/scale are exposed separately from the atom's overall
 * state so the "push toward the nucleus, cloud falls out of focus" beat
 * can fade/shrink just the cloud while the nucleus stays sharp.
 */
export const Atom: React.FC<{
  state: ObjectState;
  electronCloudOpacity?: number;
  nucleusScale?: number;
  nucleusHighlightIndex?: number | null;
}> = ({state, electronCloudOpacity = 1, nucleusScale = 0.05, nucleusHighlightIndex = null}) => {
  if (!state.visible || state.opacity <= 0.001) return null;
  const r = BASE_RADIUS * state.scale;
  const cloudOpacity = Math.min(state.opacity, electronCloudOpacity) * 0.28;

  return (
    <group position={state.position}>
      {cloudOpacity > 0.005 && (
        <mesh scale={r}>
          <sphereGeometry args={[1, 48, 32]} />
          <meshPhysicalMaterial
            color="#6fb8ff"
            transparent
            opacity={cloudOpacity}
            roughness={0.2}
            transmission={0.4}
            thickness={1}
            emissive="#3d8fff"
            emissiveIntensity={0.35}
            depthWrite={false}
          />
        </mesh>
      )}
      <Cluster
        state={{visible: true, position: [0, 0, 0], scale: r * nucleusScale, opacity: state.opacity}}
        count={6}
        memberRadius={0.4}
        spread={1}
        highlightIndex={nucleusHighlightIndex}
        seed={11}
      />
    </group>
  );
};
