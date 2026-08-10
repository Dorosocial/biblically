import React, {useMemo} from 'react';
import * as THREE from 'three';
import {staticFile} from 'remotion';
import {useLoader} from '@react-three/fiber';

export interface EarthProps {
  position?: [number, number, number];
  scale?: number;
  rotationY?: number;
  visible?: boolean;
  cityLightsBoost?: number; // used for the "night side" time-lapse feel
}

export const Earth: React.FC<EarthProps> = ({
  position = [0, 0, 0],
  scale = 1,
  rotationY = 0,
  visible = true,
  cityLightsBoost = 0,
}) => {
  const texture = useLoader(THREE.TextureLoader, staticFile('earth_daymap.jpg'));

  const material = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.85,
      metalness: 0.05,
      emissive: new THREE.Color('#2a3a6a'),
      emissiveIntensity: 0.05 + cityLightsBoost * 0.35,
    });
  }, [texture, cityLightsBoost]);

  if (!visible) return null;

  return (
    <group position={position} scale={scale} visible={visible}>
      <mesh rotation={[0, rotationY, 0]} material={material}>
        <sphereGeometry args={[6, 64, 64]} />
      </mesh>
      {/* thin glowing atmosphere shell */}
      <mesh>
        <sphereGeometry args={[6.18, 48, 48]} />
        <meshBasicMaterial
          color="#5fa8ff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};
