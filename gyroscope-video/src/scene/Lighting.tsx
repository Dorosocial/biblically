import React from 'react';

export const BACKDROP_COLOR = '#0d1220';

/**
 * All lighting is built directly in the Three.js scene — no HDRI/environment
 * map. The chrome material relies entirely on these lights for its
 * highlights and its base readability: ambient + hemisphere fill so the
 * rig's silhouette always reads clearly, one directional key light, and two
 * point lights (warm + cool) placed to rake bright highlights across the
 * rim and spokes.
 */
export const Lighting: React.FC = () => (
  <>
    <color attach="background" args={[BACKDROP_COLOR]} />
    <ambientLight intensity={0.75} color="#c7d2e8" />
    <hemisphereLight args={['#dce8ff', '#141a2b', 0.9]} />
    <directionalLight position={[5, 8, 6]} intensity={2.4} color="#ffffff" />
    <directionalLight position={[-4, -2, -6]} intensity={0.6} color="#8fb0ff" />
    {/* Warm point light — key highlight, camera-side */}
    <pointLight position={[3.2, 2.1, 4.2]} intensity={180} color="#ffe4c2" distance={30} decay={1.4} />
    {/* Cool point light — rim/back highlight for separation from the backdrop */}
    <pointLight position={[-4.5, 1.4, -3.2]} intensity={140} color="#bfe3ff" distance={30} decay={1.4} />
  </>
);
