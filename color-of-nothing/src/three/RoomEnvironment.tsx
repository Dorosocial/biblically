import React, {useMemo} from 'react';
import * as THREE from 'three';

interface RoomEnvironmentProps {
  roomOpacity: number;
  lampGlow: number;
  screenGlow: number;
  windowGlow: number;
}

/**
 * The POV dark room: a faint wireframe box (floor/walls/ceiling outline) plus
 * three light sources that individually appear and go dark — a lamp, a
 * screen, a window — each driven by its own glow value from the parent.
 */
export const RoomEnvironment: React.FC<RoomEnvironmentProps> = ({
  roomOpacity,
  lampGlow,
  screenGlow,
  windowGlow,
}) => {
  const edges = useMemo(() => {
    const box = new THREE.BoxGeometry(6, 4, 10);
    return new THREE.EdgesGeometry(box);
  }, []);

  return (
    <group>
      {roomOpacity > 0.002 && (
        <lineSegments geometry={edges} position={[0, 0, -3]}>
          <lineBasicMaterial color="#3a3a3a" transparent opacity={roomOpacity * 0.45} />
        </lineSegments>
      )}

      {/* lamp: small warm sphere, upper-left */}
      {lampGlow > 0.002 && (
        <group position={[-1.8, 1.1, -2]}>
          <mesh>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshBasicMaterial color="#ffdca0" transparent opacity={lampGlow} />
          </mesh>
          <pointLight color="#ffdca0" intensity={lampGlow * 1.2} distance={4} decay={2} />
        </group>
      )}

      {/* screen: faint rectangular glow, right side */}
      {screenGlow > 0.002 && (
        <mesh position={[1.9, 0.1, -3.5]}>
          <planeGeometry args={[1.1, 0.7]} />
          <meshBasicMaterial color="#bfe8ff" transparent opacity={screenGlow * 0.55} />
        </mesh>
      )}

      {/* window: rectangular outline, straight ahead */}
      {windowGlow > 0.002 && (
        <mesh position={[0, 0.6, -7.9]}>
          <planeGeometry args={[1.6, 2]} />
          <meshBasicMaterial color="#9fb6c9" transparent opacity={windowGlow * 0.25} />
        </mesh>
      )}
    </group>
  );
};
