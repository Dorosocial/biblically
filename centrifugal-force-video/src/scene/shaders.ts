// =============================================================================
// shaders.ts — GLSL for the glow halo (reused technique from the quantum
// double-slit video) and the orbit-ring trail. All time-varying uniforms are
// driven directly from the Remotion frame (see sceneState.ts) — nothing here
// runs its own clock, so a still frame always renders identically no matter
// how it's reached (required for Remotion's frame-exact rendering).
// =============================================================================
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Soft glow halo — a fresnel-rim sphere used behind the ball. Fresnel is
// computed from the real vertex normal + camera position each render, so it
// reads correctly from any angle (orbiting cameras included) without a
// billboard. Additive blending so it reads as light.
// ---------------------------------------------------------------------------
const haloVertex = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const haloFragment = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  uniform vec3 uColor;
  uniform float uIntensity;
  void main() {
    float rim = 1.0 - clamp(dot(normalize(vNormalW), normalize(vViewDir)), 0.0, 1.0);
    float glow = pow(rim, 2.1);
    gl_FragColor = vec4(uColor * glow * uIntensity, glow * uIntensity);
  }
`;

export const makeHaloMaterial = (color: THREE.ColorRepresentation, intensity = 1) =>
  new THREE.ShaderMaterial({
    vertexShader: haloVertex,
    fragmentShader: haloFragment,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: intensity },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

// ---------------------------------------------------------------------------
// Orbit-ring trail. Applied to a TorusGeometry (rotated flat into the XZ
// orbit plane by the component using it). uProgress reveals the ring
// progressively around its tubular (angular) UV coordinate — used both for
// "the trail chases the ball as it orbits" and "vectors build up into a full
// circle" beats. uHeadGlow brightens the leading edge like a comet head.
// ---------------------------------------------------------------------------
const ringVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uProgress; // 0..1, how much of the ring (from angle 0) is revealed
  uniform float uOpacity;
  uniform vec3 uColor;
  void main() {
    float a = vUv.x; // 0..1 around the tube's angular direction
    float within = step(a, uProgress);
    float head = smoothstep(0.0, 0.06, uProgress - a) * (1.0 - smoothstep(0.06, 0.16, uProgress - a));
    float alpha = within * uOpacity;
    vec3 col = uColor * (1.0 + head * 1.8);
    gl_FragColor = vec4(col, alpha);
  }
`;

export const makeRingMaterial = (color: THREE.ColorRepresentation) =>
  new THREE.ShaderMaterial({
    vertexShader: ringVertex,
    fragmentShader: ringFragment,
    uniforms: {
      uProgress: { value: 1 },
      uOpacity: { value: 1 },
      uColor: { value: new THREE.Color(color) },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
