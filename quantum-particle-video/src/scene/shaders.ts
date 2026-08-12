// =============================================================================
// shaders.ts — GLSL for the glow halo, the wavefunction "field" material, and
// the detection-screen pattern. All time-varying uniforms are driven directly
// from the Remotion frame (see sceneState.ts) — nothing here runs its own
// clock, so a still frame always renders identically no matter how it's
// reached (required for Remotion's frame-exact rendering).
// =============================================================================
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Soft glow halo — a fresnel-rim sphere used behind the particle, the
// detectors, and the classical ball's contrastless rim. Fresnel is computed
// from the real vertex normal + camera position each render, so it reads
// correctly from any angle (orbit shots included) without needing a
// billboard — no extra bookkeeping beyond what three.js's camera matrices
// already give us per frame. Additive blending so it reads as light.
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
// Wavefunction / probability-amplitude field material. Applied to a highly
// subdivided icosahedron ("lobe") or a stretched plane ("connecting sheet").
// Vertex shader displaces along the normal with layered sine ripples so the
// surface visibly undulates. Fragment shader adds a fresnel rim + soft
// translucent core so it never reads as a solid ball — always a cloud/field.
// ---------------------------------------------------------------------------
const waveVertex = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vDisp;
  void main() {
    vec3 p = position;
    float n1 = sin(p.x * 3.2 + uTime * 1.6) * cos(p.y * 2.6 - uTime * 1.1);
    float n2 = sin(p.z * 4.1 - uTime * 2.0 + p.x * 1.7);
    float disp = (n1 * 0.6 + n2 * 0.4) * uAmplitude;
    vDisp = disp;
    vec3 displaced = p + normal * disp;
    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const waveFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vDisp;
  void main() {
    float fresnel = pow(1.0 - clamp(dot(normalize(vNormalW), normalize(vViewDir)), 0.0, 1.0), 1.6);
    float core = 0.28;
    float shimmer = 0.15 * vDisp;
    float alpha = clamp((core + fresnel * 0.75 + shimmer) * uOpacity, 0.0, 1.0);
    vec3 col = uColor * (0.7 + fresnel * 0.8);
    gl_FragColor = vec4(col, alpha);
  }
`;

export const makeWaveMaterial = (color: THREE.ColorRepresentation) =>
  new THREE.ShaderMaterial({
    vertexShader: waveVertex,
    fragmentShader: waveFragment,
    uniforms: {
      uTime: { value: 0 },
      uAmplitude: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });

// ---------------------------------------------------------------------------
// Detection-screen pattern material. Three independently blendable pattern
// contributions (interference bands / two-band collapse / multi-outcome
// glowing regions) let sceneState.ts cross-fade smoothly between them instead
// of hard-cutting.
// ---------------------------------------------------------------------------
const screenVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const screenFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uInterferenceAmt;
  uniform float uTwoBandAmt;
  uniform float uMultiAmt;
  uniform float uPanelGlow;
  uniform vec3 uColor;

  float gaussian(float x, float center, float width) {
    float d = (x - center) / width;
    return exp(-d * d);
  }

  float interferencePattern(float x) {
    float envelope = gaussian(x, 0.0, 0.85);
    float fringes = pow(cos(x * 22.0), 2.0);
    return envelope * fringes;
  }

  float twoBandPattern(float x) {
    return gaussian(x, -0.32, 0.10) + gaussian(x, 0.32, 0.10);
  }

  float multiOutcomePattern(float x, float t) {
    float v = 0.0;
    v += gaussian(x, -0.55, 0.09) * (0.6 + 0.4 * sin(t * 1.3 + 0.0));
    v += gaussian(x, -0.18, 0.09) * (0.6 + 0.4 * sin(t * 1.7 + 1.4));
    v += gaussian(x, 0.14, 0.09) * (0.6 + 0.4 * sin(t * 1.1 + 2.7));
    v += gaussian(x, 0.52, 0.09) * (0.6 + 0.4 * sin(t * 1.9 + 4.1));
    return v;
  }

  void main() {
    float x = (vUv.x - 0.5) * 2.0;
    float pattern =
      uInterferenceAmt * interferencePattern(x) +
      uTwoBandAmt * twoBandPattern(x) +
      uMultiAmt * multiOutcomePattern(x, uTime);
    float panel = 0.05 + uPanelGlow * 0.04;
    float intensity = clamp(pattern, 0.0, 1.6);
    vec3 col = uColor * intensity + vec3(0.05, 0.06, 0.09) * panel;
    gl_FragColor = vec4(col, clamp(panel + intensity, 0.0, 1.0));
  }
`;

export const makeScreenMaterial = (color: THREE.ColorRepresentation) =>
  new THREE.ShaderMaterial({
    vertexShader: screenVertex,
    fragmentShader: screenFragment,
    uniforms: {
      uTime: { value: 0 },
      uInterferenceAmt: { value: 0 },
      uTwoBandAmt: { value: 0 },
      uMultiAmt: { value: 0 },
      uPanelGlow: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
