// A sparse, softly twinkling particle field that runs for the entire video,
// independent of whatever beat is active. This guarantees the frame is never
// literally static — even during the "punctuated pause" and the final
// freeze-frame, this keeps drifting underneath the foreground composition.
import React, {useMemo} from 'react';
import * as THREE from 'three';

const vertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  varying float vTwinkle;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.15 + aSeed * 6.2831) * 0.15;
    p.y += cos(uTime * 0.12 + aSeed * 4.71) * 0.12;
    vTwinkle = 0.4 + 0.6 * (0.5 + 0.5 * sin(uTime * 0.8 + aSeed * 30.0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (2.0 + aSeed * 2.5) * (12.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  varying float vTwinkle;
  uniform vec3 uColor;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float falloff = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor * vTwinkle, falloff * vTwinkle * 0.55);
  }
`;

export const AmbientField: React.FC<{time: number; count?: number; color?: string}> = ({
  time,
  count = 220,
  color = '#6fb8ff',
}) => {
  const {geometry, material} = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.6;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 2;
      seeds[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {uTime: {value: 0}, uColor: {value: new THREE.Color(color)}},
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return {geometry: geo, material: mat};
  }, [count, color]);

  material.uniforms.uTime.value = time;

  return <points geometry={geometry} material={material} />;
};
