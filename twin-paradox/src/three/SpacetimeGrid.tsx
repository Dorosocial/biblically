import React, {useMemo, useRef, useLayoutEffect} from 'react';
import * as THREE from 'three';

// Large plane, glowing wireframe, gently warped (dipped) near the Earth and
// spacecraft positions to sell "objects curve spacetime" without ever
// pretending to be a rigorous GR embedding diagram.
const VERT = /* glsl */ `
  uniform vec2 warpA; // earth position (local xz->uv)
  uniform vec2 warpB; // spacecraft position
  uniform float warpAStrength;
  uniform float warpBStrength;
  varying float vDepth;
  varying vec2 vUv;

  float bump(vec2 p, vec2 c, float s) {
    float d = distance(p, c);
    return s / (1.0 + d * d * 0.06);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    float dip = bump(pos.xy, warpA, warpAStrength) + bump(pos.xy, warpB, warpBStrength);
    pos.z -= dip;
    vDepth = dip;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 glowColor;
  uniform float opacity;
  varying float vDepth;
  varying vec2 vUv;
  void main() {
    float edgeFade = smoothstep(0.0, 0.12, min(vUv.x, min(vUv.y, min(1.0 - vUv.x, 1.0 - vUv.y))));
    float glow = 0.55 + vDepth * 0.6;
    gl_FragColor = vec4(glowColor * glow, opacity * edgeFade);
  }
`;

export interface SpacetimeGridProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  size?: number;
  segments?: number;
  visible?: boolean;
  opacity?: number;
  color?: string;
  warpA?: [number, number]; // xz local coords of earth
  warpB?: [number, number]; // xz local coords of spacecraft
  warpAStrength?: number;
  warpBStrength?: number;
}

export const SpacetimeGrid: React.FC<SpacetimeGridProps> = ({
  position = [0, 0, 0],
  rotation = [-Math.PI / 2, 0, 0],
  size = 60,
  segments = 48,
  visible = true,
  opacity = 0.55,
  color = '#5fc9ff',
  warpA = [0, 0],
  warpB = [10, 0],
  warpAStrength = 3.2,
  warpBStrength = 1.1,
}) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      warpA: {value: new THREE.Vector2(...warpA)},
      warpB: {value: new THREE.Vector2(...warpB)},
      warpAStrength: {value: warpAStrength},
      warpBStrength: {value: warpBStrength},
      glowColor: {value: new THREE.Color(color)},
      opacity: {value: opacity},
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useLayoutEffect(() => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.warpA.value.set(warpA[0], warpA[1]);
    u.warpB.value.set(warpB[0], warpB[1]);
    u.warpAStrength.value = warpAStrength;
    u.warpBStrength.value = warpBStrength;
    u.opacity.value = opacity;
    (u.glowColor.value as THREE.Color).set(color);
  });

  if (!visible) return null;

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[size, size, segments, segments]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        wireframe
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};
