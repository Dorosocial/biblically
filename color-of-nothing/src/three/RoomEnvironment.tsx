import React, {useMemo} from 'react';
import * as THREE from 'three';
import {gentleSine} from './lib/utils';
import {MOOD_RIM} from './lib/palette';

interface RoomEnvironmentProps {
  roomOpacity: number;
  lampGlow: number;
  screenGlow: number;
  windowGlow: number;
  seconds: number;
}

const BASELINE = 0.16;

/**
 * The POV dark room: a faint moody-blue wireframe box (floor/walls/ceiling
 * outline) plus three light sources — a lamp, a screen, a window. Each keeps
 * a dim glowing rim-light silhouette even while "off", so the room stays
 * legibly readable rather than going fully invisible/black — only the
 * brightness on top of that baseline rises and falls as each source
 * switches on and off.
 */
export const RoomEnvironment: React.FC<RoomEnvironmentProps> = ({
  roomOpacity,
  lampGlow,
  screenGlow,
  windowGlow,
  seconds,
}) => {
  const edges = useMemo(() => {
    const box = new THREE.BoxGeometry(6, 4, 10);
    return new THREE.EdgesGeometry(box);
  }, []);

  const screenEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.1, 0.7)), []);
  const windowEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.6, 2)), []);

  // A slow continuous breathing pulse on the room's rim-light, so the
  // wireframe is never a flat static line even while nothing else changes.
  const roomBreath = 0.85 + gentleSine(seconds, 5.6, 0.15, 0);

  return (
    <group>
      {roomOpacity > 0.002 && (
        <lineSegments geometry={edges} position={[0, 0, -3]}>
          <lineBasicMaterial
            color={MOOD_RIM}
            transparent
            opacity={roomOpacity * (0.4 + BASELINE * 0.6) * roomBreath}
          />
        </lineSegments>
      )}

      {/* lamp: always a dim glowing silhouette, brightening warmly when "on" */}
      {roomOpacity > 0.002 && (
        <group position={[-1.8, 1.1, -2]}>
          <mesh>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshBasicMaterial
              color={lampGlow > 0.05 ? '#ffdca0' : MOOD_RIM}
              transparent
              opacity={roomOpacity * Math.max(BASELINE, lampGlow) * roomBreath}
            />
          </mesh>
          <pointLight color="#ffdca0" intensity={lampGlow * 1.2} distance={4} decay={2} />
        </group>
      )}

      {/* screen: dim rim outline always visible, fills in with a glow when "on" */}
      {roomOpacity > 0.002 && (
        <group position={[1.9, 0.1, -3.5]}>
          <lineSegments geometry={screenEdges}>
            <lineBasicMaterial
              color={screenGlow > 0.05 ? '#bfe8ff' : MOOD_RIM}
              transparent
              opacity={roomOpacity * Math.max(BASELINE, screenGlow * 0.8) * roomBreath}
            />
          </lineSegments>
          {screenGlow > 0.002 && (
            <mesh>
              <planeGeometry args={[1.1, 0.7]} />
              <meshBasicMaterial color="#bfe8ff" transparent opacity={roomOpacity * screenGlow * 0.5} />
            </mesh>
          )}
        </group>
      )}

      {/* window: rectangular rim outline, dims (rather than vanishes) when "off" */}
      {roomOpacity > 0.002 && (
        <group position={[0, 0.6, -7.9]}>
          <lineSegments geometry={windowEdges}>
            <lineBasicMaterial
              color={MOOD_RIM}
              transparent
              opacity={roomOpacity * Math.max(BASELINE, windowGlow * 0.5) * roomBreath}
            />
          </lineSegments>
          {windowGlow > 0.002 && (
            <mesh>
              <planeGeometry args={[1.6, 2]} />
              <meshBasicMaterial color="#9fb6c9" transparent opacity={roomOpacity * windowGlow * 0.22} />
            </mesh>
          )}
        </group>
      )}
    </group>
  );
};
